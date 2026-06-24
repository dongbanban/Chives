# 测试基础设施

## Parent

PRD: 前端技术融合 Demo 项目初始化 (../PRD.md)

## What to build

搭建 Vitest + React Testing Library + jsdom 测试基础设施。编写 2-3 个样例测试覆盖 Zustand store 纯函数测试和 TanStack Query hook 集成测试（配合 MSW）。配置覆盖率报告。

## Acceptance criteria

- [ ] `pnpm test` 运行 Vitest，测试通过
- [ ] Vitest 配置 jsdom 环境正常
- [ ] Zustand store 纯函数测试：验证状态变更逻辑
- [ ] Query hook 集成测试：MSW 拦截请求，验证 hook 返回正确的 loading/data/error 状态
- [ ] `pnpm test --coverage` 生成覆盖率报告
- [ ] @testing-library/jest-dom 的 matcher 可用
- [ ] `@testing-library/user-event` 集成可用

## Blocked by

- 项目骨架搭建
EOF
