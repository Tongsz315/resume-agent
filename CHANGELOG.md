# Changelog

所有重要的项目变更都会在此文件中记录。

## [2.1.0] - 2026-04-21

### ✨ 新增功能
- **经历改写** - 提供保守优化和更强表达两个版本
- **项目优化** - 提供项目简介、个人贡献、STAR面试三个版本，附带量化建议
- **Tab 切换展示** - 将结果分为匹配分析、自我介绍、经历改写、项目优化
- **用户反馈机制** - 支持点赞、差评、重新生成功能
- **二次优化** - 对生成内容进行进一步优化（更简洁、更适合面试等）

### 📦 新增文件
**后端：**
- `server/src/services/rewriter.ts` - 经历改写和项目优化核心逻辑

**前端：**
- `client/src/components/FeedbackButtons.tsx` - 用户反馈组件
- `client/src/components/ExperienceRewriter.tsx` - 经历改写组件
- `client/src/components/ProjectOptimizer.tsx` - 项目优化组件
- `client/src/components/ResultTabs.tsx` - Tab 切换组件

### 🔧 修改文件
**后端：**
- `server/src/routes/analysis.ts` - 新增 4 个 API 接口：
  - `POST /api/rewrite` - 经历改写
  - `POST /api/project-optimize` - 项目优化
  - `POST /api/refine` - 二次优化
  - `POST /api/feedback` - 用户反馈

**前端：**
- `client/src/components/index.ts` - 导出新组件
- `client/src/App.tsx` - 整合新功能，使用 Tab 展示

### 🎯 优化改进
- 更新了面试问题预测的 prompt，让问题更具体、深入，覆盖简历深挖、技术/专业、行为/情景、职业规划等类型

---

## [1.0.0] - 2026-04-21 (初始版本)

### ✨ 核心功能
- 支持文本粘贴和 PDF/Word 文件上传
- 简历内容解析
- 简历与 JD 匹配分析
- 关键词匹配度评分（0-100）
- 优劣势分析
- 定制化自我介绍生成
- 面试问题预测
- 简历评分（完整度、规范性、关键词）
- 薪资参考
- 优化建议

### 🎨 UI 功能
- 多主题支持（亮色/暗色）
- 国际化支持
- 历史记录
- 导出功能
- 响应式设计

### 📦 技术栈
- 前端：React 18 + TypeScript + Vite + TailwindCSS
- 后端：Node.js + Express + TypeScript
- AI：智谱 GLM-4 Flash API
- 文件解析：pdf-parse、mammoth
