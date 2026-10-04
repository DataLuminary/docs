---
description: DataLuminary 产品概览：全链路 BI、AI 洞察、插件化生态与私有化交付定位说明。
---

# DataLuminary 产品概览

DataLuminary 是面向 AI 时代的开源 BI 数据洞察平台。它把数据源接入、数据集建模、指标治理、图表生成、仪表盘编排、权限协作与 AI 洞察串成一条完整链路，帮助组织把分散数据转化为可复用、可解释、可协作的决策资产。

## 一句话定位

**DataLuminary = 全链路 BI + AI 数据洞察 + 插件化生态 + 私有化交付。**

它既可以作为独立 BI 产品部署，也可以成为 LuminaryWorks 生态中的数据洞察中枢。

## 三种分析方式

| 使用方式 | 适合人群 | 典型场景 |
|----------|----------|----------|
| 拖拽完成 | 业务用户、运营、产品、管理者 | 日报、经营分析、设备大屏、销售看板 |
| AI 分步骤打磨 | 数据分析师、BI 团队、研发团队 | 指标设计、图表推荐、仪表盘优化、洞察报告 |
| 一句话生成 | 管理者、业务负责人、一线团队 | “帮我生成本季度销售转化漏斗并标出异常波动” |

三种方式共享同一套数据集、图表、仪表盘、权限与插件体系，因此生成结果可以继续编辑、发布、审计和复用。

## 读者入口

按角色从 [开始](/start/) 分流（普通用户 / 开发者 / 企业客户 / 投资者）。本页保留主题索引：

- [设计理念](./design-philosophy.md) · [产品形态](./shape.md) · [完整产品能力](./features.md) · [未来版本](./upcoming.md)
- [战略白皮书](./whitepaper.md) · [产品愿景](./vision.md) · [生态协同](./ecosystem.md)
- [数据集与分析存储](./dataset-modeling.md)（实现：[零配置供给](../develop/dataset-provisioning.md)）
- [AI 洞察](./ai-insights.md)（实现：[AI 洞察设计](../develop/ai-insights.md)）
- [仪表盘与布局](./dashboard-layout-plugins.md) · [仪表盘交互](./dashboard-interactions.md) · [场景 Demo](./scenario-demo.md)
- [统一身份与企业 SSO](./unified-identity.md) · [无障碍范围](./accessibility-scope.md)
- [状态告警卡片](../plugins/status-alarm-card.md) · 附录：[自由布局固定尺寸](./position-layout-fixed-canvas.md)

开发与发版规划在 MetaRepo [`plan/`](https://github.com/DataLuminary/DataLuminary-Platform/tree/main/plan)，不在本站展开。

## 核心能力一览

- 全链路 BI：数据源、数据集、指标维度、图表、仪表盘、发布协作。
- **统一身份**：LuminaryWorks 账号 / 企业 SSO（Auth Gateway）；资源权限产品内自管。
- AI 数据洞察：从辅助配图、仪表盘推荐到一句话生成的完整工作流。
- 插件化架构：数据源、图表、面板、交互、AI 能力均可扩展。
- 全栈 TypeScript：前后端、插件 SDK、Schema 与契约统一，利于 AI 辅助开发。
- 私有化部署：适配从轻量试点到企业级数据规模的部署形态。
