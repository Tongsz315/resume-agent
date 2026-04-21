import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// 日志目录
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 生成日志文件名（按天）
const getLogFileName = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `app-${year}-${month}-${day}.log`;
};

// 基础日志函数
const logger = {
  info: (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[INFO] ${timestamp} - ${message}\n`;
    console.log(logMessage);
    // 写入文件
    fs.appendFileSync(path.join(logsDir, getLogFileName()), logMessage);
  },
  error: (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[ERROR] ${timestamp} - ${message}\n`;
    console.error(logMessage);
    // 写入文件
    fs.appendFileSync(path.join(logsDir, getLogFileName()), logMessage);
  },
  warn: (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[WARN] ${timestamp} - ${message}\n`;
    console.warn(logMessage);
    // 写入文件
    fs.appendFileSync(path.join(logsDir, getLogFileName()), logMessage);
  },
};

// 请求日志中间件
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || 'unknown';

  // 监听响应结束事件
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const logMessage = `${method} ${url} ${status} ${duration}ms - ${ip}`;
    logger.info(logMessage);
  });

  next();
};

// 错误日志中间件
const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const method = req.method;
  const url = req.url;
  const ip = req.ip || 'unknown';
  const errorMessage = err.message || 'Unknown error';
  const stack = err.stack || '';

  logger.error(`Error in ${method} ${url} from ${ip}: ${errorMessage}\nStack: ${stack}`);
  next(err);
};

export { logger, requestLogger, errorLogger };
