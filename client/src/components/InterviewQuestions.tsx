import React from 'react';
import { useTheme } from '../contexts';

const InterviewQuestions: React.FC<{ questions: string[]; onCopy: () => void }> = ({ questions, onCopy }) => {
  const { isDark } = useTheme();
  if (questions.length === 0) return null;

  return (
    <div className={`rounded-2xl p-6 md:p-8 transition-colors ${
      isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.06)]' : 'bg-white border border-[rgba(0,0,0,0.04)]'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>预测面试问题</h2>
        <button
          onClick={onCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
            isDark ? 'bg-[rgba(255,255,255,0.08)] text-[#2997ff]' : 'bg-[#f5f5f7] text-[#0071e3]'
          }`}
        >
          复制全部
        </button>
      </div>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-[rgba(41,151,255,0.06)]' : 'bg-[rgba(0,113,227,0.04)]'}`}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{
              background: isDark ? '#2997ff' : '#0071e3'
            }}>
              {i + 1}
            </span>
            <span className={`text-sm pt-1 ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewQuestions;
