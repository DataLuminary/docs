# 开发布局插件

布局插件是 **页内的容器**：分组（行）、标签页、轮播。它不决定整页是网格还是大屏。整页几何见 [开发仪表盘插件](./guide-dashboard.md)。开始前读 [二开红线](./constraints.md)。

对照分组：`DataView/src/plugins/layout/row/`。同目录还有 `tab`、`swiper`。`placeholder` 只有 `Panel`、没有 `Config`，不要当作完整模板。

## 负责什么

| 要做 | 不要做 |
|------|--------|
| 在当前页里划分槽位，槽内放下一级画布或图表 | 修改整页缩放、滚动或逻辑分辨率 |
| `Config` 编辑容器自身（标题、标签项、轮播间隔） | 为槽内图表另写一套取数 |
| 嵌套时使用宿主传入的 `dashboardKind` | 在自由大屏的槽里创建网格页 |

`package.json` 的 `mode` 是 `layout`。没有 `defineLayout`。入口导出 `{ meta, Panel, Config }`。

## 同家族嵌套

宿主把当前仪表盘种类传给配置组件的 `dashboardKind`（`grid` | `position` | `list`）。新建嵌套页时必须使用这个值。

这是产品约束：分组只是容器，坐标系跟整页走。否则 Focus Mode 无法用同一套编辑器打开内部，分享和权限也无法按同一资源模型保存。

## Focus Mode

用户从分组、标签或轮播「进入内部」时，不是打开一个新路由去改另一份无关 JSON。`FocusModeController` 建立本地版本：

- 保存：合并回根仪表盘的 `panels`。
- 取消：丢弃本地修改。

布局插件要提供进入内部的入口，但不要自己实现第二套保存协议，也不要拿 Focus Mode 去做跳转或明细弹层。

## 登记

在 `DataView/src/plugins/layout/index.ts` 写入 `LayoutBuildIn` 与 `LayoutBuildInList`。

## 做完自检

- 同一分组放进网格页和自由大屏时，内部画布种类与宿主一致。
- 容器不发起查询，不写入 `actionValues`。筛选仍由交互插件负责。
- 取消 Focus Mode 后，容器外的图表位置和配置不变。
- 运行态容器上的纯装饰不挡住槽内图表的点击；可点击热点才接收事件。
