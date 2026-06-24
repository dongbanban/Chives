# 设置页 (Settings)

## Parent

PRD: 前端技术融合 Demo 项目初始化 (`docs/prd-0001-tech-demo.md`)

## What to build

构建设置/偏好页面。主演示 Zustand persist 将状态持久化到 localStorage，配合 shadcn Toggle/Select/Switch 组件。展示偏好设置在页面刷新后仍然保留。

## Acceptance criteria

- [ ] `/settings` 页面渲染设置项（至少 3 项：通知开关、语言选择、列表密度）
- [ ] 所有设置项的状态由 Zustand persist store 管理
- [ ] 修改任意设置后刷新页面，状态从 localStorage 恢复
- [ ] shadcn Toggle 组件控制布尔开关
- [ ] shadcn Select 组件控制选项
- [ ] shadcn Switch 组件控制开关

## Blocked by

- 项目骨架搭建
EOF
