# 开发交互插件

交互插件是仪表盘上的筛选控件：输入、单选、下拉、时间。它只把当前值写成运行时状态。开始前读 [二开红线](./constraints.md)。

对照内置时间选择：`DataView/src/plugins/actions/time-picker/`。`inputer` 的 `version` 为 `unfinished`，不要拿它当模板。

## 负责什么

| 要做 | 不要做 |
|------|--------|
| 展示控件，并把值写入 `actionValues[flag]` | 图表之间互相 `emit` / `on` |
| 编辑态配置 `flag`、默认值、可选项 | 在控件里请求数据集或拼 SQL |
| 让 `FilterEngine` 去派生各图的附加条件 | 自己调用某张图的刷新方法 |
| 需要跳转时，只上报事件 | 做成「打开链接 / 打开仪表盘」控件 |

打开另一张仪表盘或外链是交互规则，不是这类插件。见 [仪表盘交互能力](/product/dashboard-interactions)。

## 目录

```text
DataView/src/plugins/actions/<kind>/
  package.json
  index.ts
  components/Panel.tsx
  components/Config.tsx
  img/logo.svg
```

没有统一的 `defineAction`。入口导出普通模块：

```typescript
export default {
  meta,
  Panel,
  Config,
  ConfigForm: BaseActionConfig,
  FormClass: BaseActionConfig,
};
```

`package.json` 的 `mode` 必须是 `action`。`kind` 在仪表盘里唯一，例如 `time-picker`。

## 写入状态

运行时值在 `useDashboardRuntimeStore`。键是配置里的 `flag`，不是插件 `kind`。同一张仪表盘上两个时间控件要有两个 `flag`。

```tsx
const setActionValue = useDashboardRuntimeStore((state) => state.setActionValue);
const actionValues = useDashboardRuntimeStore((state) => state.actionValues);

const runtime = actionValues[config?.flag] as string | undefined;
const value = runtime !== undefined ? runtime : config?.default;

const handleChange = (next: string) => {
  if (config?.flag) setActionValue(config.flag, next);
};
```

宿主订阅 `actionValues` 后，`FilterEngine.computeForPanel` 为图表生成附加条件并重新 `POST semantic/query`。交互控件自己不是查询目标：引擎对 `mode === "action"` 的块不产生过滤。

因此：

- `flag` 由配置面板填写，并在文案里告诉配置的人「这个值会被哪些图消费」。
- 不要在 `Panel` 里 import 折线图或改 `panel.query`。
- 不要用 hover 调用 `setActionValue`。划过不是筛选入口。

## 配置面板

`Config` 编辑 `flag`、标题、默认值和控件专有选项。界面文案进 locale，禁止 `t()` 的 `defaultValue`。

若选项来自数据集字段，使用宿主传给 `Config` 的 `panel` 读取已绑定的字段，不要自己发查询。时间、单选、下拉的现有 `Config` 是对照实现。

## 和图表点击的分工

| 来源 | 谁处理 | 插件做什么 |
|------|--------|------------|
| 筛选控件改值 | `setActionValue` → FilterEngine | 交互插件写入 flag |
| 图表数据点点击 | 下钻，然后联动，然后交互规则 | 图表插件调用 `onPlotClick`，不自己过滤 |
| 菜单、热点 | 版本级交互规则 | 插件只调用 `onInteractionEvent` |
| 打开页面或外链 | `openDashboard` / `openUrl` / `openDetail` | 不新建 Action |

## 登记

在 `DataView/src/plugins/actions/index.ts` 增加静态 import，写入 `ActionSourceBuildIn` 和 `ActionSourceBuildInList`。

## 做完自检

- 改变控件值后，绑定了该 `flag` 的图表条件变化；未绑定的图不重查。
- 控件自己没有发起 `semantic/query`。
- 没有跳转代码。若需要跳转，交互规则里能配，插件只上报事件。
- 清空或离开可撤销：值回到 `actionValues` 的空状态，而不是残留在组件 `useState` 里。
- 编辑态与查看态都读同一份 `actionValues`，刷新查看页后默认值行为与配置一致。
