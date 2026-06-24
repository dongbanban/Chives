# 仪表盘页 (Dashboard)

## Parent

PRD: 前端技术融合 Demo 项目初始化 (../PRD.md)

## What to build

构建一个数据仪表盘页面。主演示 ECharts 图表的渲染和 Zustand 客户端状态驱动图表交互（切换指标、调整时间范围等），Query 负责拉取聚合数据。

## Acceptance criteria

- [ ] `/dashboard` 页面渲染至少 2 种 ECharts 图表类型（如柱状图和折线图）
- [ ] 图表数据通过 Query hook 从 MSW 获取
- [ ] 图表指标切换（如"销售额/订单数"）通过 Zustand store 驱动，切换时图表重新渲染
- [ ] 时间范围筛选（如"本周/本月/本季度"）触发 Query 重新请求
- [ ] echarts-for-react 桥接正常，图表响应式缩放
- [ ] shadcn Card 组件包裹每个图表区域

## Blocked by

- 项目骨架搭建
EOF
