import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts';

interface FeedbackButtonsProps {
  contentType: 'analysis' | 'rewrite' | 'intro';
  content: string;
  sessionId?: string;
  onRegenerate?: () => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ contentType, content, sessionId, onRegenerate }) => {
  const { isDark } = useTheme();
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);

  const sendFeedback = async (type: 'like' | 'dislike' | 'regenerate') => {
    try {
      await axios.post('/api/feedback', { type, contentType, content, sessionId, timestamp: Date.now() });
      setFeedbackSent(type);
      if (type === 'regenerate' && onRegenerate) onRegenerate();
    } catch (error) {
      console.error('反馈发送失败', error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>这个结果如何？</span>
      <button
        onClick={() => sendFeedback('like')}
        disabled={feedbackSent !== null}
        className={`p-2 rounded-lg text-sm transition-all hover:scale-110 active:scale-95 disabled:opacity-50 ${
          feedbackSent === 'like' ? (isDark ? 'text-[#30d158]' : 'text-[#34c759]') : (isDark ? 'text-[#6e6e73]' : 'text-[#86868b]')
        }`}
      >👍</button>
      <button
        onClick={() => sendFeedback('dislike')}
        disabled={feedbackSent !== null}
        className={`p-2 rounded-lg text-sm transition-all hover:scale-110 active:scale-95 disabled:opacity-50 ${
          feedbackSent === 'dislike' ? (isDark ? 'text-[#ff453a]' : 'text-[#ff3b30]') : (isDark ? 'text-[#6e6e73]' : 'text-[#86868b]')
        }`}
      >👎</button>
      {onRegenerate && (
        <button
          onClick={() => sendFeedback('regenerate')}
          disabled={feedbackSent !== null}
          className={`p-2 rounded-lg text-sm transition-all hover:scale-110 active:scale-95 disabled:opacity-50 ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}
        >🔄</button>
      )}
      {feedbackSent && (
        <span className={`text-xs font-medium ${isDark ? 'text-[#30d158]' : 'text-[#34c759]'}`}>
          {feedbackSent === 'like' ? '感谢反馈' : feedbackSent === 'dislike' ? '已记录' : '重新生成中...'}
        </span>
      )}
    </div>
  );
};

export default FeedbackButtons;
