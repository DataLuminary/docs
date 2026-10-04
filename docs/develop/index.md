---
description: DataLuminary 开发文档：架构、API、嵌入、SSO、插件二开与交互引擎实现。
---

# 开发导览

DataLuminary 由两个独立仓库组成，本站「开发」栏目放**集成与实现说明**；发版规划在 MetaRepo `plan/`。

| 层 | 仓库 | 职责 |
|----|------|------|
| DataView | 前端 SPA | 编辑器、插件 UI、嵌入只读页 |
| DataTalk | NestJS API | 连接、数据集、查询、权限、分享、订阅 |

## 文档地图

| 主题 | 链接 |
|------|------|
| 架构概览 | [architecture](./architecture.md) |
| API / 契约索引 | [api](./api.md) |
| 嵌入对接 | [embed-integration](./embed-integration.md) |
| 企业 SSO | [iam-enterprise-sso](./iam-enterprise-sso.md) |
| 私有化权限 | [iam-private-deploy](./iam-private-deploy.md) |
| 权限架构（产品文档） | [权限架构设计](/permission/architecture) |
| 插件与二开 | [从这里开始](/plugins/) · [关键选型](/plugins/decisions) · [二开红线](/plugins/constraints) |
| 交互 / 布局 / 过滤 / AI / 数据集 | 见侧栏「开发」其余条目 |

读者路径：[开发者入口](/start/developer)。设计理念（产品向）：[设计理念](/product/design-philosophy)。
