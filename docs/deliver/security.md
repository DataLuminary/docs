# 安全与合规

> 售前与技术调研常用页。只写**已具备**与**明确缺口**；缺口同步记入 [未来版本](/product/upcoming)，不把路线图写成现状。

## 已具备（产品侧可对外叙述）

| 能力 | 说明 | 文档 |
|------|------|------|
| 统一身份 / 企业 SSO | SaaS 走 LuminaryWorks 账号；私有化对接企业 IdP | [统一身份](/product/unified-identity) |
| 资源级 ACL | 空间 / 看板 / 数据集等 Casbin 权限 | [权限架构](/permission/architecture) |
| 分享与嵌入令牌 | 受控分享、嵌入场景的访问边界 | [嵌入](/share/embed) · [嵌入对接](/develop/embed-integration) |
| 私有化部署心智 | 面向隔离网络与企业差异交付 | [产品形态](/product/shape) · [私有化权限对接](/develop/iam-private-deploy) |

## 已知缺口 / 需个案说明

| 主题 | 现状 | 落点 |
|------|------|------|
| 审计日志（谁在何时改了什么） | 产品叙事尚未形成统一「审计中心」对外能力页 | [upcoming](/product/upcoming) |
| 合规认证（等保 / SOC2 / ISO） | 无现成证书叙事；按部署与客户合同个案评估 | upcoming + 商务 |
| 多租户硬隔离边界 | 依赖部署拓扑与 Identity / 空间模型；需交付时写清 | 权限架构 + 私有化对接 |
| 数据驻留与密钥托管 | 视私有化/云方案而定，文档未给统一 SLA 表 | upcoming |

## 调研建议

1. 先锁定部署形态（SaaS / 标准私有化 / 完全离线）。  
2. 身份走统一账号还是企业 SSO：[统一身份](/product/unified-identity)。  
3. 资源授权是否满足组织模型：[权限概念](/permission/) · [架构](/permission/architecture)。  
4. 将本页缺口清单与客户 RFP 对照，缺项进合同附件或 [upcoming](/product/upcoming) 需求，而不是口头承诺。
