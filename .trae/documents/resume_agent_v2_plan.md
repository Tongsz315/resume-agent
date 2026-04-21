# Resume Agent V2 迭代实现计划

## 一、项目现状分析

### 当前功能

* ✅ 支持文本粘贴和 PDF/Word 文件上传

* ✅ 简历内容解析（pdf-parse、mammoth）

* ✅ 简历与 JD 匹配分析

* ✅ 关键词匹配度评分（0-100）

* ✅ 优劣势分析

* ✅ 定制化自我介绍生成

* ✅ 面试问题预测、简历评分、薪资参考等扩展功能

### 技术架构

* **前端**: React 18 + TypeScript + Vite + TailwindCSS

* **后端**: Node.js + Express + TypeScript

* **AI**: 智谱 GLM-4 Flash API

* **文件解析**: pdf-parse、mammoth

* **其他**: 多主题、国际化、历史记录等

### 代码结构

```
resume-agent/
├── client/                     # 前端应用
│   ├── src/
│   │   ├── components/         # UI 组件
│   │   ├── contexts/           # 上下文管理
│   │   ├── App.tsx            # 主应用
│   │   └── ...
├── server/                     # 后端服务
│   ├── src/
│   │   ├── routes/            # API 路由
│   │   ├── services/          # 业务逻辑
│   │   └── ...
└── ...
```

***

## 二、V2 迭代目标与范围

### 产品目标

将 Resume Agent 从"简历分析工具"升级为"简历优化智能体"，解决"只分析不落地"的问题。

### 迭代范围（V2.1）

* 新增 **经历改写** 功能

* 新增 **项目经历优化** 功能

* 新增 **结果卡片化展示**

* 新增 **用户反馈机制**（点赞/差评/重新生成）

* 优化现有的分析结果结构

***

## 三、详细实现方案

### 1. 后端 API 改造

#### 1.1 新增路由接口 (`server/src/routes/analysis.ts`)

新增以下接口：

**POST /api/rewrite**

* 用途：改写某段经历

* 请求体：

  ```json
  {
    "originalText": "原始经历文本",
    "jdText": "岗位 JD",
    "rewriteType": "experience" // experience | project
  }
  ```

* 响应体：

  ```json
  {
    "success": true,
    "originalText": "原始经历",
    "rewrittenTextBasic": "保守优化版",
    "rewrittenTextAdvanced": "更强表达版",
    "rewriteReason": "优化说明"
  }
  ```

**POST /api/project-optimize**

* 用途：优化项目经历

* 请求体：

  ```json
  {
    "projectText": "项目描述",
    "jdText": "岗位 JD"
  }
  ```

* 响应体：

  ```json
  {
    "success": true,
    "projectIntro": "项目简介优化版",
    "personalContribution": "个人贡献拆解版",
    "starVersion": "STAR 风格面试讲述版",
    "quantizationTips": ["量化建议1", "量化建议2"]
  }
  ```

**POST /api/refine**

* 用途：二次优化已有结果

* 请求体：

  ```json
  {
    "text": "已有内容",
    "goal": "more-concise" // more-concise | more-product | more-interview
  }
  ```

* 响应体：

  ```json
  {
    "success": true,
    "refinedText": "优化后内容"
  }
  ```

**POST /api/feedback**

* 用途：收集用户反馈

* 请求体：

  ```json
  {
    "type": "like" | "dislike" | "regenerate",
    "contentType": "analysis" | "rewrite" | "intro",
    "content": "相关内容"
  }
  ```

* 响应体：

  ```json
  { "success": true }
  ```

#### 1.2 新增服务模块 (`server/src/services/`)

* **`rewriter.ts`**: 实现经历改写、项目优化、二次优化的核心逻辑

#### 1.3 修改现有分析接口 (`/api/analyze`)

优化输出结构，增加模块化结果，保持向后兼容。

***

### 2. 前端改造

#### 2.1 新增组件

**ExperienceRewriter.tsx**

* 经历改写组件

* 功能：

  * 选择/输入要改写的内容

  * 显示两个版本（保守版/加强版）

  * 显示优化说明

  * 一键复制功能

  * 继续优化按钮

  * 反馈按钮

**ProjectOptimizer.tsx**

* 项目优化组件

* 功能：

  * 输入项目描述

  * 展示三个优化版本

  * 量化建议提示

  * 复制功能

**ResultTabs.tsx**

* Tab 切换组件

* 将现有结果分为多个卡片：

  * 匹配分析

  * 优势/待提升

  * 自我介绍

  * 经历改写（新）

  * 项目优化（新）

**FeedbackButtons.tsx**

* 反馈按钮组件

* 支持点赞、差评、重新生成

#### 2.2 修改现有组件

* **`App.tsx`**: 整合新功能，管理改写/优化状态

* **`ResultDisplay.tsx`**: 重构为卡片化展示，或拆分为多个子组件

* **组件导出 (`index.ts`)**: 导出新组件

#### 2.3 新增状态管理

* 在 `App.tsx` 中新增：

  * `selectedExperience`: 当前选择要改写的经历

  * `rewriteResult`: 改写结果

  * `projectOptimizationResult`: 项目优化结果

  * `activeTab`: 当前激活的 Tab

***

## 四、实施步骤

### 阶段一：后端开发

1. **创建** **`rewriter.ts`** **服务模块**

   * 实现 `rewriteExperience()` 函数

   * 实现 `optimizeProject()` 函数

   * 实现 `refineContent()` 函数

   * 复用现有的 `callGLM()` 函数

2. **扩展** **`analysis.ts`** **路由**

   * 新增 `/api/rewrite` 路由

   * 新增 `/api/project-optimize` 路由

   * 新增 `/api/refine` 路由

   * 新增 `/api/feedback` 路由

3. **测试后端接口**

### 阶段二：前端开发

1. **创建新组件**

   * `ExperienceRewriter.tsx`

   * `ProjectOptimizer.tsx`

   * `ResultTabs.tsx`

   * `FeedbackButtons.tsx`

2. **改造现有组件**

   * 修改 `App.tsx`，整合新功能

   * 重构 `ResultDisplay.tsx`

3. **集成与联调**

### 阶段三：测试与优化

1. 端到端功能测试
2. 错误处理优化
3. 用户体验调整

***

## 五、文件清单

### 新增文件

* `server/src/services/rewriter.ts`

* `client/src/components/ExperienceRewriter.tsx`

* `client/src/components/ProjectOptimizer.tsx`

* `client/src/components/ResultTabs.tsx`

* `client/src/components/FeedbackButtons.tsx`

### 修改文件

* `server/src/routes/analysis.ts`

* `server/src/services/analyzer.ts`（优化现有分析逻辑）

* `client/src/App.tsx`

* `client/src/components/ResultDisplay.tsx`

* `client/src/components/index.ts`

***

## 六、风险与应对

### 风险 1：模型输出格式不稳定

**应对**：

* 使用严格的 JSON schema 约束 prompt

* 增加格式验证和 fallback 逻辑

* 关键信息使用正则提取作为备选方案

### 风险 2：API 调用超时

**应对**：

* 保持现有的超时配置（120s）

* 增加友好的加载提示

* 提供重试机制

### 风险 3：用户不知道如何使用

**应对**：

* 保持界面简洁直观

* 增加使用提示和示例

* 在关键操作处添加引导

***

## 七、后续迭代方向（V2.2+）

* 更复杂的继续优化功能

* 简历内容分段解析与可视化

* 导出 DOCX/PDF 功能

* 多岗位对比分析

* 用户登录与云端存储

