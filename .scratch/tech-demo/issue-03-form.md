# 表单页 (Form Demo)

## Parent

PRD: 前端技术融合 Demo 项目初始化 (`docs/prd-0001-tech-demo.md`)

## What to build

构建一个包含文本输入、下拉选择、多行文本的表单页面。主演示 TanStack Query 的 `useMutation` 和 shadcn Form 组件的配合，Zustand 暂存表单草稿（刷新不丢失）。

## Acceptance criteria

- [ ] `/form-demo` 页面渲染完整表单（Input/Select/Textarea + shadcn Form）
- [ ] 表单提交使用 `useMutation`，成功后触发 Toast 提示
- [ ] 表单草稿存入 Zustand store，页面刷新后恢复
- [ ] 提交成功后清空草稿
- [ ] 提交失败时表单内容保留（从 Zustand 恢复）
- [ ] shadcn Form 的校验错误正常显示
- [ ] shadcn Toast 组件正常弹出和消失

## Blocked by

- 项目骨架搭建
EOF
