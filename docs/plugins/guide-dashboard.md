# 开发仪表盘插件

仪表盘插件决定 **整页怎么排**。页内的分组、标签、轮播是另一类插件，见 [开发布局插件](./guide-layout.md)。开始前读 [二开红线](./constraints.md)。

对照：

| kind | 目录 | 场景 |
|------|------|------|
| `grid` | `DataView/src/plugins/dashboard/grid/` | 可滚动的门户和报表 |
| `position` | `DataView/src/plugins/dashboard/position/` | 固定逻辑尺寸的大屏 |
| `list` | `DataView/src/plugins/dashboard/list/` | 移动端单列 |

没有 `defineDashboard`。模块导出 `{ meta, Panel, Config }`。`package.json` 的 `mode` 是 `dashboard`。

## 负责什么

| 要做 | 不要做 |
|------|--------|
| 按本家族的坐标系摆放子块 | 在插件里查询数据或渲染图表细节 |
| 声明本页是网格、自由画布还是列表 | 把行、标签、轮播写进仪表盘插件 |
| 子块仍是 panel、action 或 layout | 发明第四套「卡片运行时」 |

三种内置家族不要随便增加第四种，除非产品明确要一种新的整页坐标系。多数二开需求是新图表或新装饰，不是新仪表盘插件。

## 三种几何不能混用

- `grid`：给需要纵向滚动的分析。不要把它做成固定 1920×1080。
- `position`：固定宽高（默认 1920×1080，也可 2K / 4K）加绝对定位，再整体等比缩放。禁止按内容把高度撑高。
- `list`：单列。编辑态可以按手机宽度预览。

自由布局的决议见 [自由布局固定尺寸](/product/position-layout-fixed-canvas)。实现说明见 [自由布局大屏设计与实现](/develop/dashboard-position-layout)。

## 嵌套与 Focus Mode

布局插件在页内开槽。槽里再嵌一张画布时，`dashboardKind` 必须和当前页相同：自由大屏里只能再嵌自由大屏，不能嵌网格。

进入分组、标签或轮播内部时，编辑器使用 Focus Mode（`FocusModeController`）：一份独立草稿，保存才合并回根 `panels`，取消则丢弃。不要用这套草稿去实现「打开明细」。明细是交互规则 `openDetail`。

## 登记

在 `DataView/src/plugins/dashboard/index.ts` 写入 `DashboardBuildIn` 与 `DashboardBuildInList`。键是 `kind`：`grid`、`position`、`list`。

现有网格包名是历史拼写 `@data-view/gird`。新插件使用正确的包名，不要复制这个拼写。

## 做完自检

- 只影响整页几何，图表仍然只接收宿主给的数据。
- `position` 在 1920×1080 与更宽视口上是缩放，不是重排增长高。
- 页内分组仍由布局插件完成，且嵌套家族一致。
- Focus Mode 取消后，根画布与进入前一致。
- 用户大屏配色没有被产品品牌色校验拦住。

产品侧说明见 [仪表盘与布局插件](/product/dashboard-layout-plugins)。
