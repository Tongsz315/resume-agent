export type FeedbackType = 'like' | 'dislike' | 'regenerate';
export type SuggestionType = 'accuracy' | 'relevance' | 'format' | 'other';

export interface UserFeedback {
  sessionId?: string;
  timestamp: number;
  type: FeedbackType;
  contentType: string;
  rating?: number;
  suggestionType?: SuggestionType;
  comment?: string;
  actions?: string[];
  timeSpent?: number;
  context?: {
    resumePreview?: string;
    jdText?: string;
  };
  output?: any;
}

interface FeedbackStats {
  total: number;
  like: number;
  dislike: number;
  ratings: number[];
  avgRating: number;
}

// 内存中的反馈存储（生产环境建议用数据库）
const feedbackStore: UserFeedback[] = [];

/**
 * 记录用户反馈
 */
export async function recordFeedback(feedback: UserFeedback): Promise<{ success: boolean }> {
  const record: UserFeedback = {
    ...feedback,
    timestamp: Date.now()
  };
  
  feedbackStore.push(record);
  
  console.log(`✅ 反馈已记录 - 类型: ${feedback.type}, 内容类型: ${feedback.contentType}`);
  
  // 定期清理旧数据
  if (feedbackStore.length > 1000) {
    feedbackStore.splice(0, 500);
  }
  
  return { success: true };
}

/**
 * 获取反馈统计
 */
export function getFeedbackStats(): FeedbackStats {
  const total = feedbackStore.length;
  const like = feedbackStore.filter(f => f.type === 'like').length;
  const dislike = feedbackStore.filter(f => f.type === 'dislike').length;
  const ratings = feedbackStore.filter(f => f.rating).map(f => f.rating!) as number[];
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  
  return {
    total,
    like,
    dislike,
    ratings,
    avgRating
  };
}

/**
 * 获取反馈数据（用于分析）
 */
export function getFeedbacks(limit: number = 100): UserFeedback[] {
  return feedbackStore.slice(-limit).reverse();
}

/**
 * 导出反馈数据
 */
export function exportFeedbacks(): UserFeedback[] {
  return [...feedbackStore];
}

/**
 * 分析反馈趋势（简单版本）
 */
export function analyzeFeedbackTrends() {
  const stats = getFeedbackStats();
  const recentFeedbacks = getFeedbacks(50);
  
  const satisfactionRate = stats.total > 0 ? (stats.like / stats.total) * 100 : 0;
  
  return {
    satisfactionRate: Math.round(satisfactionRate),
    ...stats,
    recentSamples: recentFeedbacks.slice(0, 10)
  };
}
