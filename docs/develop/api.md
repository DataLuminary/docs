# API 参考索引

> 诚实索引：本站**不**维护完整 OpenAPI 镜像。空标题页已移除；对接时以源码与运行中的 OpenAPI 为准。

## 现状

| 表面 | 状态 | 去哪看 |
|------|------|--------|
| DataTalk HTTP API | 以服务端为准 | DataTalk 仓库；本地启动后看 Nest/Fastify OpenAPI（若已启用） |
| 查询（QueryService） | 图表与仪表盘经平台查询，不直连数据源 `query()` | [数据集零配置供给](./dataset-provisioning.md) · [架构概览](./architecture.md) |
| 嵌入 / 分享令牌 | 产品说明 + 对接文 | [嵌入](/share/embed) · [嵌入对接](./embed-integration.md) |
| 权限 / IAM | Casbin + Identity | [权限架构](/permission/architecture) · [企业 SSO](./iam-enterprise-sso.md) |
| 插件契约 | TypeScript 类型与 DataView 插件 SDK | [插件开发说明](/plugins/design) |
| 跨仓 DTO | MetaRepo 契约 | 仓库根 `spec/contracts/` |

## 图表数据形态

图表插件在插件内定义规范化数据结构；宿主通过查询结果喂数，插件不负责连库。概念见 [插件核心概念](/plugins/) · [图表插件](/plugins/panel)。

## 产品需求（文档暴露）

若对外需要「稳定、版本化的公共 API 文档站」，应在产品 backlog 单独立项（生成 OpenAPI 静态站点或标出稳定端点集）。当前缺口见 [未来版本](/product/upcoming) 与 MetaRepo 文档反馈清单。
