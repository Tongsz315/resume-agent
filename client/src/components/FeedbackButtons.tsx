import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts';

interface FeedbackButtonsProps {
  contentType: 'analysis' | 'rewrite' | 'intro';
  content: string;
  sessionId?: string;
  context?: {
    resumePreview?: string;
    jdText?: string;
  };
  onRegenerate?: () => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ 
  contentType, 
  content, 
  sessionId,
  context,
  onRegenerate 
}) => {
  const { isModern } = useTheme();
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [suggestionType, setSuggestionType] = useState<string>('');

  const sendFeedback = async (type: 'like' | 'dislike' | 'regenerate', extra?: any) => {
    try {
      await axios.post('/api/feedback', {
        type,
        contentType,
        content,
        sessionId,
        context,
        rating: rating || undefined,
        suggestionType: suggestionType || undefined,
        comment: comment || undefined,
        timestamp: Date.now()
      });
      setFeedbackSent(type);
      if (type === 'regenerate' && onRegenerate) {
        onRegenerate();
      }
    } catch (error) {
      console.error('反馈发送失败', error);
    }
  };

  const handleRatingSubmit = () => {
    if (rating > 0) {
      sendFeedback('dislike', { rating });
      setShowRating(false);
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      sendFeedback('dislike', { comment, suggestionType });
      setShowComment(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2">
        <span className={`text-sm ${isModern ? 'text-slate-500' : 'text-slate-400'}`}>
          这个结果如何？
        </span>
        
        <button
          onClick={() => sendFeedback('like')}
          disabled={feedbackSent !== null}
          className={`p-2.5 rounded-xl transition-all ${
            feedbackSent === 'like'
              ? isModern ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-900/30 text-emerald-400'
              : isModern
                ? 'hover:bg-slate-100 text-slate-500 hover:text-emerald-600'
                : 'hover:bg-slate-800 text-slate-400 hover:text-emerald-400'
          }`}
          title="有帮助"
        >
          👍
        </button>
        
        <button
          onClick={() => {
            if (feedbackSent === null) {
              setShowRating(true);
            }
          }}
          disabled={feedbackSent !== null}
          className={`p-2.5 rounded-xl transition-all ${
            feedbackSent === 'dislike'
              ? isModern ? 'bg-red-100 text-red-600' : 'bg-red-900/30 text-red-400'
              : isModern
                ? 'hover:bg-slate-100 text-slate-500 hover:text-red-600'
                : 'hover:bg-slate-800 text-slate-400 hover:text-red-400'
          }`}
          title="不满意"
        >
          👎
        </button>
        
        {onRegenerate && (
          <button
            onClick={() => sendFeedback('regenerate')}
            disabled={feedbackSent !== null}
            className={`p-2.5 rounded-xl transition-all ${
              isModern
                ? 'hover:bg-slate-100 text-slate-500'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
            title="重新生成"
          >
            🔄
          </button>
        )}
      </div>

      {showRating && !feedbackSent && (
        <div className={`p-5 rounded-2xl border ${
          isModern
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-800/50 border-slate-700'
        }`}>
          <p className={`text-sm mb-3 font-semibold ${isModern ? 'text-slate-700' : 'text-slate-300'}`}>
            请给这个结果评分（1-5星）：
          </p>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  star <= rating ? 'text-yellow-400' : 'text-slate-400'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRatingSubmit}
              disabled={rating === 0}
              className={`px-4 py-2 rounded-xl font-semibold ${
                rating === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : isModern
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
              }`}
            >
              提交评分
            </button>
            <button
              onClick={() => {
                setShowRating(false);
                setRating(0);
              }}
              className={`px-4 py-2 rounded-xl font-semibold ${
                isModern ? 'bg-slate-100 text-slate-700' : 'bg-slate-700 text-slate-300'
              }`}
            >
              取消
            </button>
          </div>
          <button
            onClick={() => {
              setShowRating(false);
              setShowComment(true);
            }}
            className={`mt-2 text-sm underline ${isModern ? 'text-slate-500' : 'text-slate-400'}`}
          >
            或者直接告诉我们问题...
          </button>
        </div>
      )}

      {showComment && !feedbackSent && (
        <div className={`p-5 rounded-2xl border ${
          isModern
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-800/50 border-slate-700'
        }`}>
          <label className={`block mb-2 text-sm font-semibold ${isModern ? 'text-slate-700' : 'text-slate-300'}`}>
            请告诉我们问题：
          </label>
          <select
            value={suggestionType}
            onChange={(e) => setSuggestionType(e.target.value)}
            className={`w-full p-2.5 rounded-xl mb-2 border ${
              isModern
                ? 'bg-white text-slate-800 border-slate-300'
                : 'bg-slate-700 text-slate-200 border-slate-600'
            }`}
          >
            <option value="">选择问题类型</option>
            <option value="accuracy">准确性问题</option>
            <option value="relevance">相关性问题</option>
            <option value="format">格式问题</option>
            <option value="other">其他问题</option>
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="请详细描述您的问题..."
            className={`w-full p-3 rounded-xl mb-3 resize-none h-24 border ${
              isModern
                ? 'bg-white text-slate-800 border-slate-300'
                : 'bg-slate-700 text-slate-200 border-slate-600'
            }`}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleCommentSubmit}
              disabled={!comment.trim()}
              className={`px-4 py-2 rounded-xl font-semibold ${
                !comment.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : isModern
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
              }`}
            >
              提交反馈
            </button>
            <button
              onClick={() => {
                setShowComment(false);
                setComment('');
              }}
              className={`px-4 py-2 rounded-xl font-semibold ${
                isModern ? 'bg-slate-100 text-slate-700' : 'bg-slate-700 text-slate-300'
              }`}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {feedbackSent && (
        <p className={`text-sm font-semibold ${
          isModern ? 'text-emerald-600' : 'text-emerald-400'
        }`}>
          {feedbackSent === 'like' ? '感谢您的反馈！' : 
           feedbackSent === 'dislike' ? '已记录，我们会持续改进' : 
           '正在重新生成...'}
        </p>
      )}
    </div>
  );
};

export default FeedbackButtons;
