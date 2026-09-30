# 二开红线

这些是产品约束，不是代码风格。实习、外包和 AI 在写插件之前先过一遍；做完再逐条自检。

原理见 [关键选型](./decisions.md)。步骤见各类手册。

## 数据

- 图表插件只渲染宿主传入的 `data`。禁止在插件里连接数据库、发 JDBC，或调用数据源上的 `query()`。
- 需要数的图绑定数据集。取数由宿主 `usePanelQueryController` 发 `POST semantic/query`。插件不自己打这个接口，也不要改回图表直连。
- 数据源插件只负责连接配置和连通测试。测试调用宿主注入的 `test()`，对应 `POST connect/test`。不要在图表里保存连接。
- 新数据库类型要同时补 DataView 配置 UI 和 DataTalk 连接器。只做表单不算做完。
- 连接密钥只提交到服务端。配置回显、详情页、日志里都不要展示明文密码。

## 交互

- 交互插件把值写入 `actionValues[flag]`，不要在图表之间 `emit` / `on`。
- 插件可以上报 `onPlotClick` 或 `onInteractionEvent`，不得自己 `navigate`、改 `location`，或打开新窗口。
- 打开仪表盘、打开外链、打开明细，配置成交互规则的 `openDashboard` / `openUrl` / `openDetail`，不要做成 Action 插件。
- 划过只做可撤销的强调或显隐。不要用 hover 写筛选条件、发查询或跳转。
- 运行态装饰默认点不中。只有配置了交互规则，或声明 `emitsInteraction` 的热点才接收点击。

## 布局

- 仪表盘插件决定整页几何：`grid` / `position` / `list`。布局插件只做页内分组：`row` / `tab` / `swiper`。
- 分组、标签、轮播里嵌套的画布必须和宿主同一家族。不要在自由大屏里嵌一个网格页。
- 进入容器内部用 Focus Mode：保存才合并回根画布，取消就丢弃。不要把 `openDetail` 做成 Focus Mode。
- 自由布局（`position`）是固定逻辑尺寸加等比缩放，默认 1920×1080。不要做成高度随内容撑高。需要滚动的分析用 `grid`。

## 属性、文案与注册

- 图表属性用 Formily JSX Schema（`SchemaField` + `BaseConfigForm`），不要为每个图表手写一套不受控的表单状态。
- 数据源连接表单用 Ant Design `Form`。不要为了「统一」把连接表单改成 Formily，也不要把图表属性改回零散的 `useState`。
- 界面文案进 locale JSON。禁止 `t("key", { defaultValue: "…" })`。
- 新的内置插件用静态 import 登记进对应的 `*BuildIn` 映射。不要靠运行时远程脚本加载作为日常开发方式。
- `package.json` 的 `mode` 与注册表分类不是同一个词。图表写 `chart` 或 `decoration`，数据源写 `data`，注册表分类仍是 `panel` / `datasource`。见 [注册与加载](./design.md)。

## 内容与品牌

- 用户仪表盘、大屏和素材的颜色不受产品工业蓝限制。不要把客户画布改成品牌色板。
- 官方 Demo 只翻译展厅卡片和仪表盘目录名称。不要翻译图表标题、字段名、轴标签和图例，也不要按语言复制一套空间。

## 明确不做

- 不做读屏、键盘陷阱、WCAG 合规。不要为插件补 `aria-*` 或无障碍专页。
- 不把资源权限写进登录令牌，也不要在插件里重算 ACL。
- 不把 Python、Java、Go 引入业务插件。插件与宿主同为 TypeScript，Node ≥ 24。
