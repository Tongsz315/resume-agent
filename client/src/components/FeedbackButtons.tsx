import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts';

interface FeedbackButtonsProps {
  contentType: 'analysis' | 'rewrite' | 'intro';
  content: string;
  onRegenerate?: () => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ contentType, content, onRegenerate }) => {
  const { isDark } = useTheme();
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);

  const sendFeedback = async (type: 'like' | 'dislike' | 'regenerate') => {
    try {
      await axios.post('/api/feedback', { type, contentType, content });
      setFeedbackSent(type);
      if (type === 'regenerate' && onRegenerate) {
        onRegenerate();
      }
    } catch (error) {
      console.error('反馈发送失败', error);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        这个结果如何？
      </span>
      <button
        onClick={() => sendFeedback('like')}
        disabled={feedbackSent !== null}
        className={`p-2 rounded-lg transition-colors ${
          feedbackSent === 'like' ? 'bg-green-100 text-green-600' :
          isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
        }`}
        title="有帮助"
      >
        👍
      </button>
      <button
        onClick={() => sendFeedback('dislike')}
        disabled={feedbackSent !== null}
        className={`p-2 rounded-lg transition-colors ${
          feedbackSent === 'dislike' ? 'bg-red-100 text-red-600' :
          isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
        }`}
        title="不满意"
      >
        👎
      </button>
      {onRegenerate && (
        <button
          onClick={() => sendFeedback('regenerate')}
          disabled={feedbackSent !== null}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
          title="重新生成"
        >
          🔄
        </button>
      )}
      {feedbackSent && (
        <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
          {feedbackSent === 'like' ? '感谢反馈！' : 
           feedbackSent === 'dislike' ? '已记录，我们会改进' : '正在重新生成...'}
        </span>
      )}
    </div>
  );
};

export default FeedbackButtons;
