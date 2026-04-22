import React from 'react';
import { useTheme } from '../contexts';

interface OptimizationTipsProps {
  tips: { category: string; content: string; priority: 'high' | 'medium' | 'low' }[];
}

const OptimizationTips: React.FC<OptimizationTipsProps> = ({ tips }) => {
  const { isDark } = useTheme();
  if (tips.length === 0) return null;

  const priorityConfig = {
    high: { color: isDark ? '#ff453a' : '#ff3b30', bg: isDark ? 'rgba(255,69,58,0.08)' : 'rgba(255,59,48,0.06)', label: '高' },
    medium: { color: '#ff9f0a', bg: isDark ? 'rgba(255,159,10,0.08)' : 'rgba(255,159,10,0.06)', label: '中' },
    low: { color: isDark ? '#2997ff' : '#0071e3', bg: isDark ? 'rgba(41,151,255,0.08)' : 'rgba(0,113,227,0.05)', label: '低' },
  };

  return (
    <div className={`rounded-2xl p-6 md:p-8 transition-colors ${
      isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.06)]' : 'bg-white border border-[rgba(0,0,0,0.04)]'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>优化建议</h2>
      <div className="space-y-3">
        {tips.map((tip, i) => {
          const config = priorityConfig[tip.priority];
          return (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: config.bg }}>
              <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium shrink-0 mt-0.5" style={{ background: config.color }}>
                {config.label}
              </span>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold mb-1" style={{ color: config.color }}>{tip.category}</h4>
                <p className={`text-sm ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>{tip.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OptimizationTips;
