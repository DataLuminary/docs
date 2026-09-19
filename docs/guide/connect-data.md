# 连接数据

目标：让图表和 AI 问数绑在**已治理的数据集**上，而不是每张图直连业务表。

## 步骤心智

1. **配置数据源** — 只负责连接与连通测试（MySQL / PostgreSQL / SQL Server / ClickHouse / Excel 等）。  
2. **创建数据集** — 选表或受控联表，定义分析要用的字段。  
3. **语义模型** — 创建时平台默认自动发布；指标与维度在此治理。  
4. **图表绑定数据集** — 查询走平台 QueryService，口径跟已发布模型。

## 深入阅读

- 产品说明：[数据集与分析存储](/product/dataset-modeling)  
- 设计理念中的数据集中枢：[设计理念](/product/design-philosophy)  
- 工程实现：[数据集零配置供给](/develop/dataset-provisioning)  

下一步：[做一张仪表盘](./build-dashboard.md)。
