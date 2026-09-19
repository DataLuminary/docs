# 大屏与交互

目标：展厅 / 监控大屏可读，点击与筛选行为可预期。

## 步骤心智

1. **自由布局**面向固定逻辑画布（常见 1920×1080 基线），按设计稿摆放，而不是「内容撑高」。见 [自由布局固定尺寸](/product/position-layout-fixed-canvas)。  
2. **交互四类**：筛选 / 联动 / 下钻等走查询状态；强调与显隐可 hover；打开仪表盘或外链走 `openDashboard` / `openUrl`，不是 Flag 控件。  
3. 配置交互前先读清产品边界，避免把「好看」做成不可审计的事件网。

## 深入阅读

- [仪表盘交互能力](/product/dashboard-interactions)  
- [场景化 Demo 展厅](/product/scenario-demo)  
- 实现：[交互引擎](/develop/dashboard-interact-engine)  

下一步：[分享与订阅](./share-subscribe.md)。
