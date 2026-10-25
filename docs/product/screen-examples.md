---
description: 经济监测、智慧城市、电网全景、站端孪生四张大屏的配置教程，含素材路径与数据包字段。
---

# 四张大屏范例

这四张自由布局大屏比普通柱状图、折线图多了三维场景、入场和卡片装饰。展厅里可以直接打开；下面按同一套步骤说明怎么自己配出来。素材和数据都在仓库里，不需要再向文档站复制一份。

应用模板会连布局、查询和素材引用一起复制到自己的空间。自己配时，画布用 **1920×1080** 自由布局。

| 范例 | 展厅模板 | 数据包 |
|------|----------|--------|
| 经济运行监测 | `sc-economy-monitor` | `demo-sc-datav-screen-v1` |
| 智慧城市 | `sc-smart-city` | `demo-sc-datav-screen-v1` |
| 四川电力全景 | `sc-power-grid` | `demo-sc-datav-screen-v1` |
| 站端孪生 | `ops-station-twin` | 运维场景 `ops-screen` |

## 四川三张共用的数据

种子在 DataTalk `src/demo-data/profiles/sc-datav-screen/`。三张表：

| 表 | 用途 | 字段 |
|----|------|------|
| `sc_region_facts` | 地市一行 | `region` 地名，`metric_value` 主数值，另有在线人数、专利号、处罚金额、同比 |
| `sc_series_facts` | 时间序列 | `period_label` 横轴文字，`period_order` 排序，`series_kind` 系列名，`metric_value` 值 |
| `sc_mix_facts` | 分类明细 | `mix_kind` 卡片类型，`label` 名称，`count_value` 数量，`score` 分值，`seq` 序号，`status` 处理状态 |

查询时：折线、柱、面积的维度用 `period_label`（按 `period_order` 升序），指标用 `metric_value`，并用 `series_kind` 过滤到「全省」「成都市」「进口」「出口」等系列。分类卡用 `mix_kind` 过滤，例如 `energy`、`goods`、`gen-summary`、`equipment`、`power-top`、`fault`。

地图本身不配指标和维度。挤出区域地图使用内置四川地市；侧栏图表才绑定上面的表。

地图底图用产品内的 `ChinaSichuan` GeoJSON（`DataView/public/map-collection`）。

## 经济运行监测

深色地形图铺满 1920×1080，左右是玻璃卡片。

1. 放一张挤出区域地图，铺满画布，压在最底层。图表配置：地图类型 **四川**，主题 **地形（3D）**，打开镜头开场，就绪变量填 `mapReady`。不要配数据源。
2. 页头用大屏标题，字体用展示字。字库在 `DataView/public/plugins/panels/screen-title/sc-datav/`。
3. 每张侧栏卡片叠三层：底板图、标题、图表。底板用图片面板，素材目录 `DataView/public/assets/demo/sc-economy/`（玻璃底板 `card-glass.png`、`glass-plate.svg`）。
4. 折线和柱绑定 `sc_series_facts`。全省、成都市各一条线；进口/出口、三产增加值按 `series_kind` 过滤。渐变柱把样式设为渐变，并写上自己的系列色。
5. 货物表绑定 `sc_mix_facts`，过滤 `mix_kind = goods`，用轮播表。
6. 侧栏面板的入场设为等变量 `mapReady` 有值后再从左或从右滑入。页头从上方滑入。这样地图开场结束，卡片才出现。
7. 底部用大屏导航菜单做成「切换样式 / 纯净模式」。交互规则写入变量 `mapStyleNew`、`mapPure`，地图图层按这两个变量显隐。

## 智慧城市

暖色城市图，左右六张卡，底部五个图层开关。

1. 地图同样铺满，主题改为 **暖色城市（3D）**，就绪变量仍是 `mapReady`。图层变量默认是 `mapCloud`、`mapHeat`、`mapBar`、`mapRotation`。
2. 卡片底板在 `DataView/public/assets/demo/sc-city/card-plate.svg`。标题用大屏标题，左对齐。
3. 面积折线用平滑面积样式，绑定 `sc_series_facts`。环形图设 `pieStyle = donut`，内半径约 0.74、外半径约 0.84、扇区间隙 14、圆角 10，并打开光晕。图例放在右侧、一列。
4. 排名、轮播表、指标走势分别绑定 `sc_mix_facts` 里对应的 `mix_kind`。
5. 底部导航用图标开关。每一项的交互把对应图层变量写成 `off` 或非 `off`。`off` 表示隐藏该层。
6. 六张卡和页头的入场都等 `mapReady`。

## 四川电力全景

蓝色网格地形，左右各三张带角标的卡片。

1. 地图主题用 **蓝色网格（3D）**，就绪变量 `mapReady`。
2. 卡片底板在 `DataView/public/assets/demo/sc-power/`（`plate.svg`、页头线 `header-lines.svg`、盾牌 `shield.svg`）。面板边框打开角标，选 **蓝色**。
3. 页头是大屏标题加文字导航（主平台、电力感知、变电站、发电排行）。导航本身不查数。
4. 发电汇总、设备数量、用电大市、故障表绑定 `sc_mix_facts`，`mix_kind` 分别是 `gen-summary`、`equipment`、`power-top`、`fault`。故障行的 `status` 是「处理中」或「已处理」。
5. 用电预测、上半年发电绑定 `sc_series_facts`，`series_kind` 为「今年」「去年」或「上半年发电」。
6. 胶囊进度若要分成一段段，把样式设为分段；颜色用面板自己的系列色，不必跟产品外壳的蓝色一致。
7. 卡片入场等 `mapReady`，左侧从左、右侧从右。

## 站端孪生

运维场景里的电厂数字孪生沙盘，数据用运维包，不用四川三张表。

1. 画布仍是 1920×1080。底层放模型查看，地址填 `/assets/demo/models/station-yard.glb`，透明底，不要自动旋转。模型文件由 `DataView/scripts/generate-station-yard-glb.mjs` 生成。
2. 顶栏、侧栏、底栏的装饰图在 `DataView/public/assets/demo/station-monitor/`。这些是产品自绘的界面图，不是外部皮肤。
3. 设备、告警、故障、损耗等卡片绑定运维场景的混合表，按标签或类型过滤。配色示例是 `#00FEA9`、`#5799D6`、`#F1BD49`，强调色 `#5BC7FA`。
4. 时钟用时钟 / 倒计时面板，不查数。场景切换若要驱动模型里的报警或巡检，把变量写到模型的场景标识 `stationScene`。

## 配完怎么对

- 地图开场结束后，侧栏才滑入。若卡片一直不出现，检查就绪变量名是否和入场等待的变量一致，并且地图没有被配成必须查询。
- 侧栏图表没有数时，先看数据集是否映射到 `sc_region_facts` / `sc_series_facts` / `sc_mix_facts`（站端则是运维包），以及过滤的 `series_kind`、`mix_kind` 是否写对。
- 展厅卡片上的封面是各模板的 `preview.thumbnailPath`，文件在 `DataView/public/assets/demo/`，文件名以 `-1920.jpg` 结尾。
