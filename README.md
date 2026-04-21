# Resume Agent - 简历分析智能体

一个面向大学生的求职简历分析 Web 应用，基于智谱 GLM 大模型。

## 功能特性

- 📄 支持文本粘贴和文件上传（PDF/Word）两种简历输入方式
- 🎯 深度分析简历内容，提取优劣势和关键词匹配度
- ✨ 根据公司背景和岗位 JD 生成定制化自我介绍
- 💡 界面简洁，操作便捷
- 📋 一键复制生成内容

## 技术栈

- **前端**：React 18 + TypeScript + Vite + TailwindCSS
- **后端**：Node.js + Express + TypeScript
- **AI**：智谱 GLM-4 Flash API
- **文件解析**：pdf-parse（PDF）、mammoth（Word）

## 快速启动

### 方式一：使用启动脚本（推荐）

双击运行 `start.bat`（Windows）或 `./start.sh`（Linux/Mac）即可自动安装依赖并启动。

### 方式二：手动安装

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd client && npm install

# 安装后端依赖
cd ../server && npm install

# 一键安装所有依赖
npm run install:all
```

### 启动开发服务器

```bash
npm run dev
```

- 前端地址：http://localhost:5173
- 后端地址：http://localhost:3001

### 环境配置

在 `server/.env` 中配置智谱 API Key：

```bash
GLM_API_KEY=your_api_key_here
PORT=3001
```

### 构建生产版本

```bash
npm run build
```

构建产物位于 `client/dist/` 目录。

## 项目结构

```
resume-agent/
├── client/                     # 前端 React 应用
│   ├── src/
│   │   ├── components/         # React 组件
│   │   │   ├── FileUploader.tsx      # 文件上传组件
│   │   │   ├── InputModeToggle.tsx   # 输入模式切换
│   │   │   ├── TextAreaInput.tsx     # 文本输入组件
│   │   │   ├── LoadingSpinner.tsx    # 加载动画
│   │   │   ├── ResultDisplay.tsx     # 结果展示
│   │   │   └── index.ts              # 组件导出
│   │   ├── App.tsx            # 主应用组件
│   │   ├── main.tsx          # 入口文件
│   │   └── index.css         # 全局样式
│   ├── index.html
│   └── package.json
├── server/                     # 后端 Express 服务
│   ├── src/
│   │   ├── index.ts          # 服务器入口
│   │   ├── routes/
│   │   │   └── analysis.ts   # API 路由
│   │   └── services/
│   │       ├── analyzer.ts   # AI 分析服务
│   │       └── fileParser.ts # 文件解析服务
│   └── package.json
├── start.bat                  # Windows 启动脚本
├── start.sh                   # Linux/Mac 启动脚本
├── package.json               # 根目录配置
└── README.md
```

## API 接口

### POST /api/upload

上传简历文件（PDF/DOCX），返回解析后的文本。

**请求**：multipart/form-data
- `file`: 简历文件

**响应**：
```json
{
  "success": true,
  "text": "解析后的简历文本...",
  "fileName": "resume.pdf"
}
```

### POST /api/analyze

分析简历并生成自我介绍。

**请求**：
```json
{
  "resumeText": "简历文本内容",
  "jdText": "岗位 JD 描述",
  "companyBackground": "公司背景介绍（可选）"
}
```

**响应**：
```json
{
  "success": true,
  "analysis": {
    "strengths": ["优势1", "优势2"],
    "weaknesses": ["劣势1"],
    "keywordMatch": 85,
    "matchAnalysis": "关键词匹配分析..."
  },
  "selfIntroduction": "生成的自我介绍..."
}
```

## 功能说明

### 输入方式
1. **粘贴文本**：直接粘贴简历内容
2. **上传文件**：支持 PDF、Word（.doc/.docx）格式

### 分析内容
- **关键词匹配度**：评估简历与岗位的匹配程度（0-100%）
- **优势分析**：简历中的亮点和与 JD 匹配的优点
- **待提升**：需要提升的方面和与 JD 要求的差距
- **定制化自我介绍**：根据简历和 JD 生成的面试开场白

### 注意事项
- 文件大小限制：10MB
- 支持的文件格式：PDF、Word（.doc/.docx）
- 分析结果仅供参考，建议结合实际情况调整

## License

MIT