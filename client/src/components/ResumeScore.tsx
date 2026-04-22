import React from 'react';
import { useTheme } from '../contexts';

const ResumeScore: React.FC<{
  completeness: number;
  formatting: number;
  keywords: number;
}> = ({ completeness, formatting, keywords }) => {
  const { isDark } = useTheme();
  const overall = Math.round((completeness + formatting + keywords) / 3);

  const getColor = (score: number) => {
    if (score >= 80) return isDark ? '#30d158' : '#34c759';
    if (score >= 60) return '#ff9f0a';
    return isDark ? '#ff453a' : '#ff3b30';
  };

  const getLabel = (score: number) => score >= 80 ? '优秀' : score >= 60 ? '良好' : '需提升';

  const scores = [
    { label: '完整度', score: completeness, desc: '教育、经历、技能等信息是否完整' },
    { label: '规范性', score: formatting, desc: '格式、排版、结构是否规范' },
    { label: '关键词匹配', score: keywords, desc: '与目标岗位的关键词匹配程度' },
  ];

  return (
    <div className={`rounded-2xl p-6 md:p-8 transition-colors ${
      isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.06)]' : 'bg-white border border-[rgba(0,0,0,0.04)]'
    }`}>
      <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>简历评分</h2>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full" style={{
          background: isDark ? `${getColor(overall)}15` : `${getColor(overall)}10`
        }}>
          <span className="text-4xl font-bold" style={{ color: getColor(overall) }}>{overall}</span>
        </div>
        <p className={`mt-3 text-sm ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>综合评分</p>
      </div>

      <div className="space-y-5">
        {scores.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: getColor(item.score) }}>{item.score}</span>
                <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ background: getColor(item.score) }}>
                  {getLabel(item.score)}
                </span>
              </div>
            </div>
            <div className={`h-1.5 rounded-full ${isDark ? 'bg-[rgba(255,255,255,0.08)]' : 'bg-[rgba(0,0,0,0.06)]'}`}>
              <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${item.score}%`, background: getColor(item.score) }} />
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeScore;
