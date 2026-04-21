import React from 'react';

interface OptimizationTipsProps {
  tips: {
    category: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

const OptimizationTips: React.FC<OptimizationTipsProps> = ({ tips }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', icon: '🔴' };
      case 'medium':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', icon: '🟡' };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', icon: '🔵' };
    }
  };

  if (tips.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        ✏️ 简历优化建议
      </h2>
      <div className="space-y-4">
        {tips.map((tip, index) => {
          const style = getPriorityStyle(tip.priority);
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${style.bg} ${style.border}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{style.icon}</span>
                <div>
                  <h4 className={`font-medium mb-1 ${style.text}`}>
                    {tip.category}
                  </h4>
                  <p className="text-gray-700">{tip.content}</p>
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