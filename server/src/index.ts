import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import analysisRouter from './routes/analysis.js';
import { requestLogger, errorLogger, checkRateLimit } from './middleware/index.js';

// 加载环境变量
config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 请求日志（开发环境）
if (process.env.NODE_ENV !== 'production') {
  app.use(requestLogger);
}

// 限流中间件（应用于所有 /api 路由）
app.use('/api', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || 'unknown';
  const rateLimit = checkRateLimit(ip);
  
  // 设置限流头
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());
  
  if (!rateLimit.allowed) {
    res.status(429).json({
      success: false,
      error: '请求过于频繁，请稍后再试',
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
    });
    return;
  }
  
  next();
});

// 路由
app.use('/api', analysisRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// 错误处理
app.use(errorLogger);

// 全局错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: '服务器内部错误，请稍后重试',
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Resume Agent Server running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   POST /api/upload    - 上传并解析简历文件`);
  console.log(`   POST /api/analyze   - 分析简历并生成自我介绍`);
  console.log(`   GET  /health        - 健康检查`);
  console.log(`📊 Rate limit: 20 requests/minute`);
});