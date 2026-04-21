// 限流配置
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1分钟
const RATE_LIMIT_MAX_REQUESTS = 20; // 每分钟最多20个请求

// 存储每个IP的请求信息
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitInfo>();

/**
 * 检查IP的请求频率是否超过限制
 */
export const checkRateLimit = (ip: string) => {
  const now = Date.now();
  const rateLimitInfo = rateLimitStore.get(ip);

  if (!rateLimitInfo) {
    // 第一次请求，初始化
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  // 检查是否在时间窗口内
  if (now > rateLimitInfo.resetTime) {
    // 时间窗口已过，重置计数
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  // 检查是否超过限制
  if (rateLimitInfo.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: rateLimitInfo.resetTime,
    };
  }

  // 更新计数
  rateLimitStore.set(ip, {
    count: rateLimitInfo.count + 1,
    resetTime: rateLimitInfo.resetTime,
  });

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - (rateLimitInfo.count + 1),
    resetTime: rateLimitInfo.resetTime,
  };
};

/**
 * 获取IP的限流状态
 */
export const getRateLimitStatus = (ip: string) => {
  const now = Date.now();
  const rateLimitInfo = rateLimitStore.get(ip);

  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    return {
      count: 0,
      remaining: RATE_LIMIT_MAX_REQUESTS,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  return {
    count: rateLimitInfo.count,
    remaining: RATE_LIMIT_MAX_REQUESTS - rateLimitInfo.count,
    resetTime: rateLimitInfo.resetTime,
  };
};

// 定期清理过期的限流记录
setInterval(() => {
  const now = Date.now();
  for (const [ip, info] of rateLimitStore.entries()) {
    if (now > info.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // 每5分钟清理一次
