import React from 'react';
import { useTheme } from '../contexts';

interface OptimizationTipsProps {
  tips: {
    category: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

const OptimizationTips: React.FC<OptimizationTipsProps> = ({ tips }) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';
  
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: isModern
            ? 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/50'
            : 'bg-gradient-to-br from-red-900/20 to-rose-900/20 border border-red-800/30',
          text: isModern ? 'text-red-700' : 'text-red-400',
          icon: '🚨'
        };
      case 'medium':
        return {
          bg: isModern
            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50'
            : 'bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border border-amber-800/30',
          text: isModern ? 'text-amber-700' : 'text-amber-400',
          icon: '💡'
        };
      default:
        return {
          bg: isModern
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50'
            : 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30',
          text: isModern ? 'text-blue-700' : 'text-blue-400',
          icon: '✨'
        };
    }
  };

  if (tips.length === 0) return null;

  return (
    <div className={`mt-6 rounded-3xl shadow-2xl p-6 md:p-8 ${
      isModern
        ? 'bg-white/80 backdrop-blur border border-slate-200/50'
        : 'bg-slate-900/80 backdrop-blur border border-slate-700/50'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
        isModern
          ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
          : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
      }`}>
        ✏️ 简历优化建议
      </h2>
      <div className="space-y-5">
        {tips.map((tip, index) => {
          const style = getPriorityStyle(tip.priority);
          return (
            <div
              key={index}
              className={`p-5 rounded-2xl ${style.bg}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{style.icon}</span>
                <div>
                  <h4 className={`font-bold mb-2 ${style.text}`}>
                    {tip.category}
                  </h4>
                  <p className={`${isModern ? 'text-slate-800' : 'text-slate-300'}`}>
                    {tip.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OptimizationTips;