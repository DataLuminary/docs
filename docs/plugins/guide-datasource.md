# 开发数据源插件

数据源插件把一种外部存储 **接进平台**：连接表单、连通测试、把配置交给 DataTalk。它不向图表供数。配图仍然要建数据集，再由语义查询取数。

开始前读 [二开红线](./constraints.md)。只做前端表单不算完成。

对照 MySQL：

- 前端 `DataView/src/plugins/datasource/mysql/`
- 后端方言 `DataTalk/src/modules/datasource/connect/connectors/relational/dialects/mysql.dialect.ts`
- 按 kind 解析 `DataTalk/src/modules/datasource/connect/connectors/registry.ts`

磁盘上的 `click-house` 版本为 `unfinished`，且没有进入 `DataSourceBuildIn`。不要把它当成已交付类型。

## 负责什么

| 层 | 要做 | 不要做 |
|----|------|--------|
| DataView | 连接表单、调用宿主 `test()` | 在图表插件里保存连接或执行 SQL |
| DataTalk | 方言、驱动、测试与元数据 | 把业务明细同步进平台库才能查询 |
| 用户路径 | 保存数据源 → 建数据集 → 图表绑定数据集 | 数据源插件提供 QueryEditor 给图表 |

当前后端 `resolveConnector` 只注册关系型：`mysql`、`mariadb`、`postgresql`、`mssql`、`excel`。其他 kind 会直接抛出不支持。

## 前端目录

```text
DataView/src/plugins/datasource/<kind>/
  package.json
  index.tsx
  components/Config.tsx
  components/Panel.tsx      # 连接详情，不是图表
  components/FormClass.ts
  img/logo.svg
```

没有 `defineDatasource`。MySQL 的入口是：

```tsx
const Panel = lazy(() => import("./components/Panel"));
const Config = lazy(() => import("./components/Config"));

const MysqlModule: PluginModule<FormClass> = {
  Config,
  Panel,
  FormClass,
  meta,
};
export default MysqlModule;
```

`package.json` 的 `mode` 写 `data`（不要写成 `datasource`）。`testable: true` 才会走连通测试。`kind` 必须和后端方言一致。

SQL Server 的 kind 是 `mssql`，注册表里另有别名 `SqlServer`、`MsSql`。PostgreSQL 的别名是 `postgres`。新插件优先使用一个规范 `kind`，别名仅在必须兼容旧数据时加。

## 连接表单

使用 Ant Design `Form`，不要用图表那套 Formily `SchemaField`。两类表单的原因见 [关键选型](./decisions.md)。

测试按钮调用宿主传入的 `test`，不要在插件里写死 URL。现成封装是 `DataView/src/plugins/datasource/hooks/useConnect.tsx`：

```tsx
await test?.();
```

宿主侧 `test` 对应 `POST connect/test`。保存连接对应 `POST datasource`，更新对应 `PATCH datasource/:mark`。元数据读取（表、列）也由 DataTalk `connect/*` 提供，插件不直连数据库。

密钥规则：

- 密码字段用遮罩输入。
- 不要在详情 `Panel`、日志或异常信息里渲染 `config.password`。
- 不要把密码写进前端可缓存的明文状态之外的展示组件。

## 后端连接器

关系型方言放在 `DataTalk/src/modules/datasource/connect/connectors/relational/dialects/`，并在该目录的注册表中纳入 `isRelationalKind`。`resolveConnector` 目前对非关系型直接拒绝。

一种新的关系型数据库至少包括：

1. 方言：引用标识、分页、时间截断等与现有方言对齐。
2. 驱动：在连接器里能按 kind 建连。
3. 测试：`connect/test` 对错误账号失败、对正确账号成功。
4. 前端插件：`kind` 与后端一致，并写入 `DataSourceBuildIn`。

非关系型（例如文档库或 HTTP API）要先扩展 `resolveConnector`，不能只在前端加一个表单。平台查询仍要落到数据集和 `POST semantic/query`，而不是插件里临时请求。

Excel 是文件型特例，走 `DataTalk/src/modules/datasource/excel/`，不要把文件上传塞进 MySQL 方言。

## 登记

`DataView/src/plugins/datasource/index.tsx`：

```tsx
export const DataSourceBuildIn = {
  [MySQLJson.kind]: MysqlModule,
};

export const DataSourceBuildInList: PluginMetaData[] = [MySQLJson];
```

## 做完自检

- 编辑器里能新建该类型，测试失败时不保存脏连接，测试成功后能保存。
- 图表列表里 **没有** 出现「用这个数据源直接做图」。下一步是数据集。
- 前端 `kind`、后端 `isRelationalKind`、错误信息三者一致。
- 详情与接口响应的界面都不展示明文密码。
- 图表插件的代码没有为这种库增加 `query()`。
- DataTalk 与 DataView 分别能通过各自的类型检查。连接器单测覆盖方言的引用与失败连接。

数据集侧行为见 [数据集与分析存储](/product/dataset-modeling)。
