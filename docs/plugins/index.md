---
description: DataLuminary 插件与二开：图表插件、数据源插件、关键选型与开发约束。
---

# 插件：从这里开始

DataLuminary 把二开放在插件上：宿主保留编辑器、查询、权限和状态，场景差异由插件吸收。

## 按你的目的

| 目的 | 阅读 |
|------|------|
| 判断要不要选这套 BI | [为什么方便二开](./why-extend.md) → [关键选型](./decisions.md) |
| 写插件之前先知道不能做什么 | [二开红线](./constraints.md) |
| 做一个新图表或装饰 | [开发图表插件](./guide-panel.md) |
| 做一个筛选控件 | [开发交互插件](./guide-action.md) |
| 做一种整页版式 | [开发仪表盘插件](./guide-dashboard.md) |
| 做分组、标签、轮播 | [开发布局插件](./guide-layout.md) |
| 接一种新的库 | [开发数据源插件](./guide-datasource.md) |
| 查注册表和 `mode` 用词 | [注册与加载](./design.md) |

## 五类插件

注册表分类（`getPlugin` 的 category）和 `package.json` 的 `mode` 不是同一个词。

| 注册表分类 | `package.json` `mode` | 目录 | 职责 |
|------------|----------------------|------|------|
| `panel` | `chart` 或 `decoration` | `DataView/src/plugins/panels/` | 图表与装饰。只渲染宿主给的数据 |
| `datasource` | `data` | `DataView/src/plugins/datasource/` | 连接配置。不向图表供数 |
| `action` | `action` | `DataView/src/plugins/actions/` | 筛选控件。把值写成 `actionValues` |
| `dashboard` | `dashboard` | `DataView/src/plugins/dashboard/` | 整页几何：`grid` / `position` / `list` |
| `layout` | `layout` | `DataView/src/plugins/layout/` | 页内容器：`row` / `tab` / `swiper` |

```text
数据源插件（配连接）
  → 数据集与语义模型
  → 宿主 POST semantic/query
  → 图表插件只渲染
  → 仪表盘 / 布局插件编排整页
```

交互插件不在这条取数链中间发请求。它写入状态，由 `FilterEngine` 派生到查询上。

## 数据从哪来

图表运行时查询是 DataTalk `POST semantic/query`，由 `usePanelQueryController` 发起。`POST query/panel` 仍留在 QueryService 上，**新插件不要调用它**。

历史文档中的 SystemJS、Vuex、图表直连 `datasource.query()` 已废弃。

## 专题

下面这些是某一类内置插件的规则，不是五类插件的通用写法：

- [图表类型一览](./panelTypes.md)
- [富文本](./rich-text.md)
- [状态告警卡片](./status-alarm-card.md)
- [大屏导航菜单](./screen-nav-menu.md)
- [图表插件概念](./panel.md) · [数据源概念](./datasource.md) · [仪表盘与布局概念](./dashboard.md)
