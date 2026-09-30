# 开发图表插件

图表插件画一种可视化或装饰。数据由宿主查询后注入。开始前读 [二开红线](./constraints.md)。

对照内置折线：`DataView/src/plugins/panels/line/`。

## 负责什么

| 要做 | 不要做 |
|------|--------|
| `Panel` 用 `data` + `config` 渲染 | 自己请求数据库或 `POST semantic/query` |
| `Config` 用 Formily Schema 编辑 `panel.config` | 手写一套与 Schema 无关的表单状态 |
| 用 `definePanelPlugin` 声明能力和默认配置类 | 调用其他图表插件，或自己跳转页面 |
| 数据点点击交给 `onPlotClick` | 在 `onClick` 里写筛选或 `window.open` |

纯展示（图片、视频、边框）可以声明不依赖查询，但仍然不要私自请求业务数据。

## 目录

```text
DataView/src/plugins/panels/<kind>/
  package.json
  index.ts
  components/Panel.tsx
  components/Config.tsx
  types/index.ts          # 配置类，可选
  img/logo.svg
```

## package.json

`mode` 写 `chart`（装饰写 `decoration`）。注册表分类是 `panel`，不要把 `mode` 写成 `panel`。

```json
{
  "kind": "line",
  "name": "@data-view/line",
  "version": "0.0.1",
  "source": "builtin",
  "category": "BarLineChart",
  "mode": "chart",
  "label": "LineChart",
  "dependQuery": "full",
  "metricType": "multiple",
  "dimensionType": "multiple",
  "logo": "/plugins/panels/line/img/logo.svg"
}
```

`version` 为 `unfinished` 的插件会被禁用，不要把未完成插件标成正式版本。

## 入口

```typescript
export default definePanelPlugin({
  meta,
  Panel,
  Config,
  FormClass: LineChartConfigForm,
  capabilities: {
    requiresQuery: true,
    measureCardinality: "multiple",
    dimensionCardinality: "multiple",
    supportsDrill: true,
    supportsLink: true,
  },
});
```

`definePanelPlugin` 在 `DataView/src/plugins/panels/definePanelPlugin.ts`。缺 `Config` 时会变成空配置，缺 `FormClass` 时用空配置类。不要依赖这种兜底交付插件。

`capabilities` 告诉宿主这张图要不要查询、能否下钻和联动、属性面板出现在完整编辑器还是大屏侧栏。装饰若有可点击热点，设置 `emitsInteraction`，例如 `["menuItem"]`。没有这项的装饰在运行态点击穿透。

## 渲染

宿主传入的核心 props 是 `config`、`data`、`condition`、`loading`，以及可选的 `onPlotClick`、`onInteractionEvent`。折线只把数据交给渲染 hook：

```tsx
const Panel = ({ data, config, condition, onPlotClick }: Props) => {
  const { container } = useRenderChart(data, condition, config, onPlotClick);
  return <div ref={container} className="full-height" />;
};
```

内置统计图目前走 AntV G2，表格走 AntV S2。你可以在自己的 `Panel` 里换渲染库，但 option 的组装留在插件内部，不要把某个库的完整 option 当作 `panel.config` 的公开协议。

插件不得在这里 `navigate`。跳转由交互规则处理，见 [开发交互插件](./guide-action.md) 与 [关键选型](./decisions.md)。

## 属性

使用 `BaseConfigForm` 和 `SchemaField`。这是 JSX Schema，不是 JSON 文件。

```tsx
const Config = ({ config, onChange }: Props) => {
  const { t } = useTranslation();
  return (
    <BaseConfigForm config={config || new LineChartConfigForm()} onChange={onChange}>
      <SchemaField.String
        name="visual.lineType"
        title={t("editor.visual.lineType")}
        x-decorator="FormItem"
        x-component="Radio.Group"
      />
    </BaseConfigForm>
  );
};
```

折线的完整字段在 `panels/common/components/visual/VisualLine.tsx`：`name` 是写入 `config` 的路径，`title` 用已有 locale key，选项用 `enum`。不要发明新的 `defaultValue` 文案。

约定：

- 文案用 `t("key")`，key 写入 DataView 全部 locale，禁止 `defaultValue`。
- 新控件先注册到 `DataView/src/plugins/panels/common/constants/SchemaField.ts` 的 `createSchemaField({ components })`。
- 字段联动放 Formily effects，不要在每个输入框里互相 `setState`。
- `onChange` 由宿主 debounce 后写入 `panel.config`。不要把这份实时 config 再当作 `BaseConfigForm` 的新初始值，否则输入过程中表单会被重建。
- 画布级标题、边框由编辑器壳处理。插件只保存本图专有的 `config`。

## 登记

在 `DataView/src/plugins/panels/index.ts` 静态 import，并写入 `PanelSourceBuildIn`，键为 `package.json` 的 `kind`。

```typescript
import lineChart from "./line/index";
import lineChartJson from "./line/package.json";

export const PanelSourceBuildIn = {
  [lineChartJson.kind]: lineChart,
};
```

不要把远程 `fetchPlugin` 当作开发步骤。内置插件随 DataView 打包。

## 做完自检

- `Panel` 里没有数据库客户端、没有 `semantic/query`、没有 `query()`。
- `Config` 的改动能回到 `panel.config`，刷新后仍在。
- 联动和下钻通过宿主回调，插件没有自己改别的图。
- 装饰默认可被点击穿透；只有声明了热点的才接收点击。
- 用户画布颜色没有被改成产品品牌蓝。
- `pnpm type-check` 通过，且没有 `any`。

更细的查询与交互实现见 [交互引擎](/develop/dashboard-interact-engine)。个别内置图的特殊规则（富文本、状态告警、大屏导航）见本目录后面的专题，不要把专题例外当成所有图表的写法。
