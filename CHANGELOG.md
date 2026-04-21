# Changelog

所有重要的项目变更都会在此文件记录。

## [2.1.0] - 2026-04-21

### ✨ 新增功能
- **SSE 流式输出**: 实现了服务器发送事件的流式分析，提供实时进度展示和结果推送
- **岗位策略引擎**: 
  - 技术开发策略
  - 产品经理策略
  - 设计师策略
  - 运营策略
  - 支持不同岗位的差异化分析维度和权重配置
- **增强反馈系统**:
  - 1-5星评分系统
  - 问题类型选择（准确性/相关性/格式/其他）
  - 详细评论功能
  - 完整的数据闭环，支持趋势分析
- **新增组件**:
  - `StrategySelector`: 岗位类型选择器
  - `StreamOutput`: 流式输出展示组件
  - `useStreamAnalysis`: 流式分析 Hook

### 🔧 技术改进
- 重构了 LLM 服务层，统一了调用接口
- 完善了后端路由结构，新增流式和反馈相关端点
- 优化了数据存储和统计分析
- 增强了错误处理和用户体验

### 📄 新增文件
**后端**:
- `server/src/services/llm/provider.ts` - LLM 调用接口
- `server/src/services/analyzer/strategy/index.ts` - 岗位策略引擎
- `server/src/services/feedback.ts` - 反馈系统服务
- `server/src/routes/stream.ts` - 流式分析路由

**前端**:
- `client/src/components/StrategySelector.tsx` - 岗位选择器
- `client/src/components/StreamOutput.tsx` - 流式输出组件
- `client/src/hooks/useStreamAnalysis.ts` - 流式分析 Hook

### 🎯 优化总结
本次迭代完成了 PRD 中要求的所有高优先级功能，产品现已具备：
- ✅ 更专业的岗位策略分析
- ✅ 更流畅的流式输出体验
- ✅ 更完善的数据反馈闭环

---

## [2.0.0] - 2026-04-21

### ✨ 新增功能
- **经历改写**: 提供保守优化版和更强表达版两个版本
- **项目优化**: 提供项目简介、个人贡献、STAR面试版，附带量化建议
- **Tab 切换展示**: 将结果分为匹配分析、自我介绍、经历改写、项目优化四个标签页
- **用户反馈机制**: 支持点赞、差评、重新生成功能
- **二次优化**: 对生成内容进行进一步优化（更简洁、更适合面试等）

### 📦 新增文件
**后端**:
- `server/src/services/rewriter.ts` - 经历改写和项目优化核心逻辑

**前端**:
- `client/src/components/FeedbackButtons.tsx` - 用户反馈组件
- `client/src/components/ExperienceRewriter.tsx` - 经历改写组件
- `client/src/components/ProjectOptimizer.tsx` - 项目优化组件
- `client/src/components/ResultTabs.tsx` - Tab 切换组件

### 🎯 优化改进
- 更新了面试问题预测的 prompt，使问题更具体和实用
- 完善了简历分析能力，增加了更多分析维度

---

## [1.0.0] - 2026-04-21

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
- 前端: React 18 + TypeScript + Vite + TailwindCSS
- 后端: Node.js + Express + TypeScript
- AI: 智谱 GLM-4 Flash API
- 文件解析: pdf-parse、mammoth
