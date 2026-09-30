# 注册与加载

写哪一类插件、属性用什么、有哪些红线，见 [从这里开始](./index.md)。本文只说明代码里插件如何被找到。

## 静态注册

内置插件由各类 `index` 静态 import，放进 Zustand `usePluginsStore`。`getPlugin(kind, category)` 先查内置映射，再查缓存。非内置才可能走远程拉取；日常二开不要依赖远程加载。

| category | 映射 | 文件 |
|----------|------|------|
| `panel` | `PanelSourceBuildIn` | `DataView/src/plugins/panels/index.ts` |
| `datasource` | `DataSourceBuildIn` | `DataView/src/plugins/datasource/index.tsx` |
| `action` | `ActionSourceBuildIn` | `DataView/src/plugins/actions/index.ts` |
| `dashboard` | `DashboardBuildIn` | `DataView/src/plugins/dashboard/index.ts` |
| `layout` | `LayoutBuildIn` | `DataView/src/plugins/layout/index.ts` |

```typescript
const plugin = usePluginsStore.getState().getPlugin("line", "panel");
```

这不是 SystemJS，也不是 Vuex。

## mode 与 category

`package.json` 的 `mode` 描述插件自己的种类；`getPlugin` 的第二个参数是注册表分类。

| 插件 | `mode` | `getPlugin` category |
|------|--------|----------------------|
| 图表 | `chart` | `panel` |
| 装饰 | `decoration` | `panel` |
| 数据源 | `data` | `datasource` |
| 交互控件 | `action` | `action` |
| 整页几何 | `dashboard` | `dashboard` |
| 页内容器 | `layout` | `layout` |

只有图表有统一工厂 `definePanelPlugin`。其余四类导出 `{ meta, Panel, Config, ... }`。

## 元数据里会改变行为的字段

- `kind`：注册表的键，也是资源上保存的类型。数据源的 `kind` 还要和 DataTalk 连接器一致。
- `version: "unfinished"`：禁用。不要把未完成插件登记成可选用。
- `source: "builtin"`：随 DataView 打包。
- 数据源 `testable: true`：显示连通测试。
- 图表 `dependQuery`、`metricType`、`dimensionType`：编辑器用来约束字段槽位。真正是否发查询还要看 `definePanelPlugin` 的 `capabilities.requiresQuery`。

## 别名

仅数据源注册表为旧数据保留了别名，例如 `postgres` → PostgreSQL，`SqlServer` / `MsSql` → `mssql`。新类型不要先发明别名。
