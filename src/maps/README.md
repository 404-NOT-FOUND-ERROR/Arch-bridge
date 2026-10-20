# 地图数据快照

这些 GeoJSON 来自阿里云 DataV 的[地图数据选择器](https://datav.aliyun.com/portal/school/atlas/area_selector)，用于现代行政区定位；采集日期为 2026-10-19。

| 文件 | 范围 | 用法 |
|---|---|---|
| cn.json | 中国省级区域 | 全国定位轮廓 |
| hb.json | 河北省地级区域 | 河北省内逐级定位 |
| sjz.json | 石家庄市轮廓 | 地级市定位 |
| zx.json | 赵县轮廓 | 县级定位 |

构建脚本对边界做简化和统一投影，生成内嵌路径；它不是测绘底图。赵州桥定位坐标参考 [OpenStreetMap](https://www.openstreetmap.org/#map=15/37.720229/114.763280)，仅作现代地点标注。三维河流、地形与岸线独立作为教学示意，不由行政区数据推导。
