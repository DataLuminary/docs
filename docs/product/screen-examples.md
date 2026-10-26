---
description: 按编辑器步骤配置经济运行监测、智慧城市、四川电力全景、站端孪生四张 1920×1080 大屏，含数据集、每张图的指标维度过滤和交互。
---

# 四张大屏范例

下面按编辑器里的实际配置写。照着做，可以得到和展厅同一套布局、查询和交互。展厅里「应用模板」会一次复制这些内容；自己配时，用本节的表逐张填。

四张都是 **自由布局**，逻辑画布 **1920×1080**。地图、图片、标题、视频、3D 模型 **不要绑数据集**。只有表里写了指标的面板才打开查询。

| 范例 | 展厅里已有的数据集 |
|------|-------------------|
| 经济运行监测、智慧城市、四川电力全景 | `Sichuan regions`、`Sichuan series`、`Sichuan mix` |
| 站端孪生 | `Ops traffic`、`Ops mix categories` |

自己的空间没有这些数据集时，先做完下一节再摆面板。过滤值必须和表里的原文一致，例如 `series_kind = 全省`，城市收益那张是 `series_kind = trade`（不是中文「贸易」）。

## 新建画布

1. 新建仪表盘，布局选 **自由布局**。
2. 画布宽 `1920`、高 `1080`。四川三张背景用深色；站端孪生背景图填 `/assets/demo/station-monitor/page-bg.svg`，拉伸铺满。
3. 从组件栏拖面板。位置用下文的 `x, y, w, h`（左上角为原点，单位是画布像素）。同一块卡片里，底板在下、图表居中、标题在上：层级大约是底板 3、图表 4、标题 6。

侧栏卡片的入场在面板样式里设：

| 时机 | 方向 | 用在 |
|------|------|------|
| **变量就绪后**，变量名 `mapReady` | 上 | 页头 |
| 同上 | 左 | 左侧底板、标题、图表 |
| 同上 | 右 | 右侧底板、标题、图表 |
| 同上 | 下 | 底部导航 |

地图开场结束才会写入 `mapReady`。变量名不一致，或地图被配成必须查询，卡片会一直停在画布外。

## 四川三张共用的数据集

在 Demo 空间直接选上面三张数据集。自建时，数据源指向含这三张表的库，数据集用直连，然后发布语义模型。图表里选的是语义模型的 **标识**，不是列的显示名。标识按下表填写，显示名可以自定。

### Sichuan series（表 `sc_series_facts`）

| 标识 | 角色 | 列 | 聚合 |
|------|------|----|------|
| `period_label` | 维度 | `period_label` | — |
| `period_order` | 维度 | `period_order` | — |
| `series_kind` | 维度 | `series_kind` | — |
| `metric_value` | 指标 | `metric_value` | 求和 |

折线、柱、面积：**维度只放要显示的横轴**（通常是 `period_label`）。**排序**另选 `period_order` 升序，不要把 `period_order` 再拖进维度，否则横轴会多出一列数字。`period_order` 仍必须是语义模型里的维度，排序才有效。

这张表里会出现的 `series_kind`：`全省`、`成都市`、`进口`、`出口`、`三产增加值`、`今年`、`去年`、`上半年发电`、`今年同期`、`去年同期`、`trade`、`tax`、`power`。

### Sichuan mix（表 `sc_mix_facts`）

| 标识 | 角色 | 列 | 聚合 |
|------|------|----|------|
| `mix_kind` | 维度 | `mix_kind` | — |
| `label` | 维度 | `label` | — |
| `mix_id` | 维度 | `id` | — |
| `mix_seq` | 维度 | `seq` | — |
| `status` | 维度 | `status` | — |
| `count_value` | 指标 | `count_value` | 求和 |
| `score` | 指标 | `score` | 求和 |

`mix_kind` 取值：`goods`、`energy`、`gen-summary`、`equipment`、`power-top`、`fault`。排序用 `mix_seq` 或 `mix_id` 升序，同样不要放进维度，除非表上要把序号显示出来。

### Sichuan regions（表 `sc_region_facts`）

| 标识 | 角色 | 列 | 聚合 |
|------|------|----|------|
| `region` | 维度 | `region` | — |
| `region_id` | 维度 | `id` | — |
| `patent_code` | 维度 | `patent_code` | — |
| `penalty_amount` | 维度 | `penalty_amount` | — |
| `metric_value` | 指标 | `metric_value` | 求和 |
| `yoy_percent` | 指标 | `yoy_percent` | 求和 |

`penalty_amount` 在处罚表里是 **维度**（原文展示），不是求和指标。

地图不使用这三张表。挤出区域地图的底图是产品内的四川地市（`ChinaSichuan`）。

## 地图（三张四川大屏相同的摆法）

拖一张 **挤出区域地图**，位置 `0, 0, 1920×1080`，层级最低。查询留空。

| 项 | 填法 |
|----|------|
| 地图类型 | 四川（`ChinaSichuan`） |
| 主题 | 经济：`卫星地形（3D）`；城市：`暖色城市（3D）`；电力：`蓝色网格（3D）` |
| 播放镜头开场 | 打开 |
| 就绪变量（开场结束后写入） | `mapReady` |

图层一节里，「绑定变量」的值写成 `off` 表示隐藏该层。主题自带的变量名不要改：

| 大屏 | 图层变量 | 含义 |
|------|----------|------|
| 经济 | `mapStyleNew` | 地形层，默认关。底部「切换样式」把它写成 `on` |
| 经济 | `mapPure` | 暗角。勾选反向：变量为 `on` 时暗角隐藏 |
| 城市 | `mapCloud`、`mapRotation`、`mapHeat`、`mapBar` | 底栏四个开关，写成 `off` 即隐藏 |

## 经济运行监测

页头高 102。左右各两张卡，卡宽 455、高 459。左卡 `x = 20`，右卡 `x = 1445`，上排 `y = 122`，下排 `y = 601`。

1. 页头底板：图片，`0, 0, 1920×102`，地址 `/assets/demo/sc-economy/glass-plate.svg`，适应方式填满。
2. 标题：大屏标题，`12, 1, 900×100`。标题文字「经济运行监测」，变体普通，左对齐，字号 36，字体 **pmzd**，颜色 `#ffffff`。关掉面板自带标题。
3. 搜索框：图片，`1560, 10, 280×39`，地址 `/assets/demo/sc-economy/search-box.svg`。这张不参与入场，纯净模式也不隐藏它。
4. 四张卡各放一块底板：图片，`455×459`，地址 `/assets/demo/sc-economy/card-glass.png`。
5. 每张卡的标题用大屏标题，高 46，盖在底板顶上。左卡左对齐，右卡右对齐，字体仍是 pmzd。文字见下表第一列。
6. 图表放在标题下面。全省、成都市折线各高 205，上下叠在左上那张卡里（`y` 分别是 170 和 375，宽 453）。其余图表高 410，宽约 453。

查询都走语义模型。系列色在图表配置里选自定义：全省 `#ACA891`，成都市 `#6E918C`。

| 面板上的名字 | 图表 | 数据集 | 维度（显示名） | 指标（显示名） | 过滤 | 排序 |
|--------------|------|--------|----------------|----------------|------|------|
| 全省 | 折线，样式 **基础**，不填充 | Sichuan series | `period_label`（日期） | `metric_value`（全省） | `series_kind` 等于 `全省` | `period_order` 升序 |
| 成都市 | 折线，样式 **基础**，不填充 | Sichuan series | `period_label`（日期） | `metric_value`（成都市） | `series_kind` 等于 `成都市` | `period_order` 升序 |
| 进出口商品品类贸易值 | 折线，样式 **平滑面积**，不填充 | Sichuan series | `period_label`（日期）、`series_kind`（类型） | `metric_value`（贸易值） | `series_kind` 属于 `进口`、`出口` | `period_order` 升序，再按 `series_kind` 降序 |
| 三产季度增加值 | 柱，柱条样式 **渐变** | Sichuan series | `period_label`（季度） | `metric_value`（增加值） | `series_kind` 等于 `三产增加值` | `period_order` 升序 |
| 进出口商品信息 | 轮播表格 | Sichuan mix | `mix_seq`（序号）、`label`（类型） | `count_value`（数量(万)）、`score`（贸易值(万元)） | `mix_kind` 等于 `goods` | `mix_seq` 升序 |

底部导航：大屏导航菜单，`830, 1011, 260×49`，变体 **胶囊按钮**。两项写成 `style:切换样式` 和 `pure:纯净模式`（key 是冒号左边）。

选中这块导航，打开 **交互**，加两条规则，触发都是 **菜单项**：

1. key 填 `style`。效果 **设置变量**，变量名 `mapStyleNew`，固定值 `on`，打开切换（再点一次清掉）。
2. key 填 `pure`。两个效果：设置变量 `mapPure` = `on`（同样打开切换）；**显示 / 隐藏面板** 选切换，目标勾上页头底板、页头标题，以及四张卡的底板、标题和全部图表。不要勾地图、搜索框和导航自己。

保存仪表盘后再看。开场结束后卡片从两侧滑入。「切换样式」打开地形层，「纯净模式」藏起卡片和暗角。

## 智慧城市

页头用 **四川大屏场景**，铺在 `0, 0, 1920×80`。图表配置里场景（`scene`）填 `demo1`，部件（`piece`）填 `header`。不查数。标题文字由这个部件自己画（「四川省智慧城市数据大脑」）。

左右各三张卡。底板都是图片 `/assets/demo/sc-city/card-plate.svg`，`455×307`。左卡 `x = 20`，右卡 `x = 1445`，三行的 `y` 是 `100`、`427`、`753`。标题用大屏标题，变体条形、左对齐，放在底板顶上约 32 像素高。图表比底板内缩约 14 像素。

| 面板上的名字 | 图表 | 数据集 | 维度（显示名） | 指标（显示名） | 过滤 | 排序 / 行数 |
|--------------|------|--------|----------------|----------------|------|-------------|
| 2025年规模指标分析 | 排名榜 | Sichuan regions | `region`（地区） | `metric_value`（指标） | 无 | `metric_value` 降序，限制 5 行 |
| 企业税收分析（左中，面积） | 面积，样式 **平滑面积**，打开填充 | Sichuan series | `period_label`（月份）、`series_kind`（系列） | `metric_value`（税收） | `series_kind` 属于 `今年同期`、`去年同期` | `period_order` 升序，再按 `series_kind` 升序 |
| 行政处罚信息 | 轮播表格 | Sichuan regions | `region`（省份）、`patent_code`（专利编号）、`penalty_amount`（处罚金额） | `yoy_percent`（同比百分比） | 无 | `region_id` 升序 |
| 企业收益总数统计 | KPI 趋势 | Sichuan series | `period_label`（月份） | `metric_value`（收益） | `series_kind` 等于 `trade` | `period_label` 升序 |
| 企业能耗分析 | 饼，样式 **环形** | Sichuan mix | `label`（类型） | `count_value`（能耗） | `mix_kind` 等于 `energy` | `mix_id` 升序 |
| 企业税收分析（右下，柱） | 柱，柱条样式 **渐变** | Sichuan series | `period_label`（月份） | `metric_value`（税收） | `series_kind` 等于 `tax` | `period_order` 升序 |

环形图再设：内半径 `0.74`，外半径 `0.84`，扇区间隙 `14`，圆角 `10`，打开光晕。图例放右侧、一列。

底部导航：大屏导航菜单，`0, 980, 1920×100`，变体 **图标开关**。五项的 key 与文字：

| key | 文字 | 图标 |
|-----|------|------|
| `cloud` | 云层 | cloud |
| `rotation` | 旋转 | rotation |
| `mode` | 模式 | sparkle |
| `heat` | 热力 | heat |
| `bar` | 柱状 | bar |

交互都挂在这块导航上，触发 **菜单项**，效果 **设置变量**，固定值 `off`，并打开切换：

| key | 变量 |
|-----|------|
| `cloud` | `mapCloud` |
| `rotation` | `mapRotation` |
| `heat` | `mapHeat` |
| `bar` | `mapBar` |
| `mode` | `mapMode`，再加一个效果 **显示 / 隐藏面板**（切换），目标是页头和六张卡的底板、标题、图表 |

`off` 会藏起对应地图层。再点一次，变量清掉，图层回来。

## 四川电力全景

1. 页头装饰线：图片，`0, 0, 1920×85`，地址 `/assets/demo/sc-power/header-lines.svg`。
2. 标题：大屏标题，`12, 0, 760×84`，文字「四川电力全景感知平台」，普通、左对齐。
3. 页头导航：大屏导航菜单，`1218, 14, 620×58`，变体 **文字**。四项 key：`main` 主平台、`sense` 电力感知、`substation` 变电站、`ranking` 发电排行。这四项 **不加交互**，只作标题装饰。
4. 左右各三张底板：图片 `/assets/demo/sc-power/plate.svg`，`455×305`。左 `x = 20`，右 `x = 1445`，三行 `y` 为 `105`、`430`、`755`。
5. 每张卡的标题用 **面板标题条**，变体下划线、左对齐，宽 415、高 50，放在底板内左侧约 20 像素处。
6. 面板边框打开角标，选蓝色。发电汇总圆环中间的小盾牌是图片 `/assets/demo/sc-power/shield.svg`，约 `36×36`，叠在饼图中心（大约 `230, 313`）。

| 面板上的名字 | 图表 | 数据集 | 维度（显示名） | 指标（显示名） | 过滤 | 排序 |
|--------------|------|--------|----------------|----------------|------|------|
| 总发电量 | KPI 趋势 | Sichuan mix | 无 | `count_value`（总发电量） | `mix_kind` 等于 `gen-summary`，并且 `label` 等于 `总发电量` | 无 |
| 增长率 | 胶囊进度，进度条样式 **分段方块** | Sichuan mix | `label`（指标） | `count_value`（增长率） | `mix_kind` 等于 `gen-summary`，并且 `label` 属于 `累计增长率`、`同比增长率` | `mix_seq` 升序 |
| 季度占比 | 饼，样式 **环形** | Sichuan mix | `label`（季度） | `count_value`（占比） | `mix_kind` 等于 `energy` | `mix_id` 升序 |
| 用电量预测 | 面积，样式 **平滑面积**，打开填充 | Sichuan series | `period_label`（日期）、`series_kind`（类型） | `metric_value`（用电量） | `series_kind` 属于 `今年`、`去年` | `period_order` 升序，再按 `series_kind` 升序 |
| 上半年发电情况 | 柱，柱条样式 **渐变** | Sichuan series | `period_label`（区间） | `metric_value`（发电量） | `series_kind` 等于 `上半年发电` | `period_order` 升序 |
| 电网设备数量 | 指标图标块 | Sichuan mix | `label`（设备） | `count_value`（数量）、`score`（规模） | `mix_kind` 等于 `equipment` | `mix_seq` 升序 |
| 用电大市TOP5 | 雷达，打开填充 | Sichuan mix | `label`（城市） | `count_value`（用电量） | `mix_kind` 等于 `power-top` | `mix_seq` 升序 |
| 故障异常 | 轮播表格 | Sichuan mix | `mix_seq`（序号）、`label`（故障事件）、`status`（是否解决） | `count_value`（异常次数）、`score`（报警次数） | `mix_kind` 等于 `fault` | `mix_seq` 升序 |

季度占比的环形：内半径 `0.77`，外半径 `1`，圆角 `10`，打开光晕。`status` 列的原文是「处理中」或「已处理」。卡片入场仍等 `mapReady`，左从左、右从右、页头从上。

## 站端孪生

这张不用四川的三张表。先准备运维语义模型。

### Ops traffic（表 `ops_traffic_facts`）

| 标识 | 角色 | 列 | 聚合 |
|------|------|----|------|
| `hour_label` | 维度 | `hour_label` | — |
| `visits` | 指标 | `visits` | 求和 |
| `peak_mbps` | 指标 | `peak_mbps` | 最大值 |
| `access_frequency` | 指标 | `access_frequency` | 平均值 |

### Ops mix categories（表 `ops_mix_facts`）

| 标识 | 角色 | 列 | 聚合 |
|------|------|----|------|
| `mix_kind` | 维度 | `mix_kind` | — |
| `label` | 维度 | `label` | — |
| `count_value` | 指标 | `count_value` | 求和 |
| `score` | 指标 | `score` | 求和 |

站端用到的 `mix_kind`：`station_device`、`station_loss`、`station_fault`、`station_alarm`。设备名称必须和 `label` 原文一致。

### 摆放

1. **3D 模型**铺满 `0, 0, 1920×1080`，层级 2。地址 `/assets/demo/models/station-yard.glb`，适应 **包含**，透明底打开，自动旋转关闭。场景变量填 `stationScene`。场景效果两条：值 `alarm` 作用节点 `fx-alarm`、动作脉冲；值 `inspect` 作用节点 `fx-patrol`、动作沿路径移动，移动体 `fx-patrol-runner`。不查数。
2. 顶栏装饰：图片 `/assets/demo/station-monitor/title-bg.svg`，`0, 0, 1920×80`。
3. 主标题：大屏标题，`480, 8, 960×44`，文字「电厂数字孪生服务平台」，居中。副标题再放一块大屏标题，`480, 48, 960×22`，文字 `Power plant digital twin service platform`，字号更小，颜色 `#5BC7FA`。
4. 时钟：时钟 / 倒计时，`1480, 18, 400×44`，模式选时钟，显示日期，强调色 `#5BC7FA`。不查数。
5. 左右各三块。每块是两张图片叠起来：标题条 `/assets/demo/station-monitor/panel-title-bg.svg`（420×65），内容底 `/assets/demo/station-monitor/panel-body-bg.svg`（420×220）。左列 `x = 10`，右列 `x = 1490`。三行标题的 `y` 是 `90`、`395`、`700`，内容底在标题下 65 像素。
6. 块内标题用面板标题条，普通、左对齐、字号 16、强调色 `#5BC7FA`。文字：设备规模、主变电负荷电流变化、系统损耗监测、故障对比、视频监控、预警情况。
7. 图表系列色自定义为 `#00FEA9`、`#5799D6`、`#F1BD49`。

| 面板 | 图表 | 数据集 | 维度 | 指标 | 过滤 | 排序 |
|------|------|--------|------|------|------|------|
| 设备规模里的 9 个数字 | 数字翻牌。每个一块，宽 126、高 66，从内容区左上按 3 列排，间距 8。说明文字就是下表的设备名，后缀 `个`，小数 0，样式色块 | Ops mix categories | 无 | `count_value` | `mix_kind` 等于 `station_device`，并且 `label` 等于该设备名 | 无 |
| 主变电负荷电流变化 | 折线，平滑、不填充 | Ops traffic | `hour_label` | `visits`、`peak_mbps`、`access_frequency` | 无 | `hour_label` 升序 |
| 系统损耗监测 | 柱 | Ops mix categories | `label` | `count_value` | `mix_kind` 等于 `station_loss` | 无 |
| 故障对比 | 柱 | Ops mix categories | `label` | `count_value`、`score` | `mix_kind` 等于 `station_fault` | 无 |
| 视频监控 | 视频。地址留空时是占位；要播片就填自己的视频地址 | — | — | — | — | — |
| 预警情况 | 轮播表格 | Ops mix categories | `label` | `count_value` | `mix_kind` 等于 `station_alarm` | 无 |

九个设备名，按从左到右、从上到下：玻璃探测器、风机房、接地变110V、巡更锚点、高压探测器、红外探测器、开关柜35KV、烟感探测器、水浸探测室。

底部导航：大屏导航菜单，`680, 924, 560×56`。两项 `alarm:设备告警`、`inspect:漫游巡检`。选中后再点一次会取消（导航上打开重复点击取消）。

交互挂在这块导航上，触发 **菜单项**，并打开「再点一次还原」：

1. key `alarm`：设置变量 `stationScene` = `alarm`；**重置交互**（范围选当前观看）；**强调面板**，样式发光，目标是预警情况的内容底板和轮播表。
2. key `inspect`：设置变量 `stationScene` = `inspect`；同样重置交互。

`stationScene` 的值会驱动模型里的告警脉冲或巡检移动。站端卡片不等 `mapReady`，没有地图开场。

## 配完怎么对

- 保存图表后再保存仪表盘。只关面板编辑器，交互和查询不会落库。
- 地图开场结束后侧栏才出现。卡片不动时，核对入场变量是不是 `mapReady`，以及地图没有被配上数据集。
- 图是空的：先看数据集是不是本节的那一张，过滤值是不是原文（`trade`、`goods`、`station_device` 都不能写成中文说明）。折线横轴乱序时，检查排序是 `period_order` 而不是 `period_label`。
- 纯净模式或城市「模式」把卡片藏起来之后，再点一次同一按钮应恢复。若回不来，检查效果是不是「切换」，而不是「隐藏」。
- 展厅封面是各模板的预览图，文件在 `DataView/public/assets/demo/`，以 `-1920.jpg` 结尾。封面不参与上面的查询。

相关说明：[仪表盘交互能力](./dashboard-interactions)、[大屏导航菜单](../plugins/screen-nav-menu)、[场景化 Demo 展厅](./scenario-demo)。
