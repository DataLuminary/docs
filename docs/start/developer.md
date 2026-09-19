# 路径：开发者

面向集成方、插件作者与平台二次开发——**先读导览，再下钻实现页。**

## 建议顺序

1. [开发导览](/develop/) — 仓库边界与文档地图  
2. [架构概览](/develop/architecture) — DataView / DataTalk 分层  
3. [设计理念](/product/design-philosophy) — 为何数据集中枢、插件微内核  
4. 按集成场景选下面主题  

## 按场景

| 场景 | 产品侧（行为） | 实现侧（怎么做） |
|------|----------------|------------------|
| iframe / SDK 嵌入 | [仪表盘嵌入](/share/embed) | [第三方嵌入对接](/develop/embed-integration) |
| 企业 SSO / 私有化 IAM | [统一身份](/product/unified-identity) | [企业 SSO](/develop/iam-enterprise-sso) · [私有化权限](/develop/iam-private-deploy) · [权限架构](/permission/architecture) |
| 写图表 / 数据源插件 | — | [插件核心概念](/plugins/) · [开发说明](/plugins/design) |
| 仪表盘交互 / 过滤 | [交互能力](/product/dashboard-interactions) | [交互引擎](/develop/dashboard-interact-engine) · [全局过滤](/develop/dashboard-global-filters) |
| 布局与自由大屏 | [布局插件](/product/dashboard-layout-plugins) | [布局架构](/develop/dashboard-layout-plugins) · [自由布局](/develop/dashboard-position-layout) |
| AI 洞察管线 | [AI 洞察](/product/ai-insights) | [AI 洞察实现](/develop/ai-insights) |
| 数据集供给 | [数据集](/product/dataset-modeling) | [零配置供给](/develop/dataset-provisioning) |
| 查 HTTP / 契约 | — | [API 参考索引](/develop/api) |

工程里程碑与发版节奏在 MetaRepo [`plan/`](https://github.com/DataLuminary/DataLuminary-Platform/tree/main/plan)，不在本站展开。
