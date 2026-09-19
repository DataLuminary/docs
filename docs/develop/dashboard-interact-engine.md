# 仪表盘交互引擎：设计与实现

> **受众**：前端、全栈、架构评审  
> **产品说明**：[仪表盘交互能力](../product/dashboard-interactions.md)（原理、为何拆四类、配置步骤）  
> **契约**：MetaRepo `spec/contracts/dashboard-interactions.md`  
> **索引**：`spec/development/dashboard-interact-overview.md`

产品侧要同时做到：筛选控件改多图、主图点一下从图表跟着变、单图下钻、以及大屏上的强调 / 切页 / 跳转。若每张图自己监听别的图，或全图共享一个大 `filters` 对象，画布一大就会全量重渲染，而且无法解释「这一下为什么没联动」。本引擎用**可序列化的运行时状态 + 按图派生**，把查询类交互和表现类交互分成两条通道。

## 1. 为什么不用另外两种做法

| 做法 | 问题 |
|------|------|
| 全图订阅同一个可变 `filters` | 任一条件变化，订阅者都要重算。百张图的大屏会一起重渲染，即使大多数图的条件没变。 |
| 图表之间 `emit` / `on` | 流向写在插件里，调试要沿调用栈追。状态是事件累积出来的，刷新页面、分享链接、下钻和联动抢同一次点击时没有单一事实来源。 |

采用的模型：

1. 用户操作只写入运行时 store，不直接改其它图表的 props。
2. 每张图用 selector 读取**自己的**派生结果。查询条件没变就不请求。
3. 配置（作用范围、联动、交互规则）是版本上的数据，不是插件之间的硬编码监听。

```text
用户操作
  → Runtime Store（actionValues / linkValues / drillStates）
  → FilterEngine.computeForPanel（纯函数，按 panel 派生）
  → 仅 extraWheres / 变量实质变化的图重新查询

同一操作若还匹配交互规则
  → resolveInteractions（纯函数）
  → effectHandlers
       查询类效果写入 linkValues / actionValues（回到上面的通道）
       表现类效果写入 Presentation Store（不进 queryKey）
```

「状态驱动」指的是交互结果可序列化、可单测，不是把高亮也塞进查询缓存键。

## 2. 两条通道

| | 查询态 | 表现态 |
|--|--------|--------|
| Store | `dashboardRuntime`：`actionValues`、`linkValues`、`drillStates` | `dashboardPresentation`：emphasis、visibility、activeSlots、detail |
| 谁写入 | 筛选控件、联动点击、下钻、以及效果里的 `filterPanels` / `setVariable` | `emphasizePanels`、`togglePanels`、`activateSlot`、`openDetail` |
| 会不会改 queryKey | 会。条件变了才重新请求 | **不会**。离开页面 `resetPresentation` |
| 能否放进分享 URL | Flag 可用查询参数 `av` **只读**恢复；打开后不再回写 | 不恢复。渲染页、嵌入页也不能靠链接还原高亮或当前页签 |

这样设计是因为高亮和切页若进入 queryKey，每次强调都会打一次查询，大屏巡航会变成持续打库。跳转类效果另走导航守卫，不进任一 store 的查询指纹。

后端把 `dashboard_version.interactions` 当不透明 JSONB 存储，不解析 `effects`，也不在 QueryService 里按规则改 SQL。`filterPanels` 在前端复用与 `links` 相同的 `linkValues`，避免两套过滤语义。

## 3. 四类配置分别落在哪

| 能力 | 编辑入口 | 持久化 | 运行时 |
|------|----------|--------|--------|
| 筛选控件 | 控件面板配置：Flag、选项来源、作用范围（数据集 + 图表 + 对应字段） | 面板 config（`scopes`） | 写入 `actionValues[flag]` |
| 联动 | 编辑器顶栏「联动」 | `dashboard_version.links` | 点击主图写入 `linkValues` |
| 下钻 | 图表查询区的下钻路径 | 该图 `query.drillDown` / `isDrilled` | `drillStates`；面包屑回退 |
| 交互规则 | 面板「交互」Tab；无人值守在版本 policy | `dashboard_version.interactions` | `resolveInteractions` → `effectHandlers` |

作用范围里的「对应字段」和选项的「值字段 / 标签字段」不是同一配置。前者决定过滤图表的哪一列，必须从目标数据集字段选择（`rawName`），不接受手输。同一控件可有多行 scope。

`FilterEngine.computeForPanel` 对落在 scope 内的图追加 `extraWheres`。若该图仍走原生 SQL，同一 Flag 进入 `sqlVariables`（`{{flag}}`），不按 scope 写 Where。媒体面板不查询，不注入。

全局过滤（编辑器顶栏「过滤」）在服务端按数据集注入，与本引擎正交，可叠加。见 [全局过滤](./dashboard-global-filters.md)。

## 4. 一次点击怎么裁决

图表数据点（G2 `element:click` → `onPlotClick`）顺序固定，写在 panel-wrapper，插件不得再抢：

1. `canAdvanceDrill` 为真 → 只 `drillDown`，返回。
2. 否则若本图是某条 `links` 的主图 → 写入或再次点击清除 `linkValues`。
3. 再 `dispatchInteractionEvent({ kind: "dataPointClick" })`。

面板壳上的单击（`kind: "click"`）不经过 1 和 2。若事件目标在 `canvas` / G2 节点内，壳层点击让给数据点处理，避免点柱子时壳层规则再执行一遍。

悬停可以进 `resolveInteractions`，但 leave 阶段只保留可撤销效果（强调、显隐、复位、以及已约定可撤销的过滤）。导航类效果在 leave 时丢弃。**禁止**把 hover 接进 `FilterEngine` 作为筛数入口：划过会连续 enter/leave，查询会被打爆。

未知 `kind` 在归一化时忽略，不得抛错拆掉整页。

## 5. 交互规则的执行与表面

`useInteractionDispatcher` 读取版本上的 `interactions`，用当前面板树 uid 过滤已经删掉的目标，再调用 `dispatchResolvedInteractions`。

| 表面 | 跳转 / 开详情 |
|------|----------------|
| 查看、编辑画布上的运行态 | 允许；`openDashboard` 前检查目标 view 权限 |
| `editor-preview` | 不导航 |
| 对外 `render` | 丢掉全部导航类效果 |
| `share-embed` | 不允许 `openDashboard` |
| `openUrl` | 仅 http(s) |

装饰在运行态默认 `pointer-events` 穿透。只有配置了交互规则，或插件声明 `emitsInteraction`（如大屏导航的 `menuItem`）的热点才可点。不要给装饰层全局 `pointer-events: auto`。

大屏导航只发出「选中了哪个 `itemKey`」。切页是 `activateSlot`，跳转是 `openUrl` / `openDashboard`。插件不自己改路由。

无人值守由 `useDashboardRuntimeLifecycle` 挂载：`policy.idleResetMs` 到期且没有匹配的 idle 规则时，复位表现态并清空 linkValues；`policy.patrol` 按间隔改 `activeSlots`。离开页面清理定时器。

## 6. 代码落点（DataView）

| 路径 | 职责 |
|------|------|
| `src/types/interact.ts` | Action scope、联动相关配置类型 |
| `src/types/interaction.ts` | 版本级规则、触发、效果；`normalizeInteractionSet` |
| `src/utils/filterEngine.ts` | `computeForPanel` |
| `src/utils/interactionEngine.ts` | `resolveInteractions`（无副作用） |
| `src/store/dashboardRuntime.ts` | 查询态 |
| `src/store/dashboardPresentation.ts` | 表现态 |
| `src/interaction/effectHandlers.ts` | 效果注册表 |
| `src/interaction/navigationGuards.ts` | 跳转白名单与表面判断 |
| `src/components/wrapper/panel-wrapper/` | 点击分发、下钻、派生条件订阅 |
| `src/pages/dashboard/editor/links/` | 联动配置 |
| `src/pages/dashboard/editor/interactions/` | 交互 Tab |
| `src/plugins/actions/` | 筛选控件与作用范围表单 |

后端：`DataTalk` `dashboard_version.interactions` jsonb。复制仪表盘须 `structuredClone` 这份配置。省略字段的 PATCH 不得把已有 interactions 写成 `null`。

## 7. 不要这样做

- 在图表插件里监听其它图表事件做联动。
- 用全局大 `filters` 让所有图无差别订阅。
- 把高亮、切页、跳转塞进 `FilterEngine` 或 queryKey。
- 用 hover 写 `extraWheres` 或打开 URL。
- 把「打开仪表盘 / 外链」做成 Action 控件。跳转是交互规则，不是 Flag。
- 用多条 `filterPanels` 模仿主从联动。主从维度绑定的事实来源仍是 `links`。
