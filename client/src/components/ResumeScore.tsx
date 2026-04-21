import React from 'react';
import { useTheme } from '../contexts';

interface ScoreItemProps {
  label: string;
  score: number;
  description: string;
}

const ResumeScore: React.FC<{
  completeness: number;
  formatting: number;
  keywords: number;
}> = ({ completeness, formatting, keywords }) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-gradient-to-r from-emerald-500 to-green-500', text: 'text-emerald-600', label: '优秀' };
    if (score >= 60) return { bg: 'bg-gradient-to-r from-amber-500 to-yellow-500', text: 'text-amber-600', label: '良好' };
    return { bg: 'bg-gradient-to-r from-red-500 to-rose-500', text: 'text-red-600', label: '需提升' };
  };

  const overall = Math.round((completeness + formatting + keywords) / 3);

  return (
    <div className={`rounded-3xl shadow-2xl p-6 md:p-8 ${
      isModern
        ? 'bg-white/80 backdrop-blur border border-slate-200/50'
        : 'bg-slate-900/80 backdrop-blur border border-slate-700/50'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
        isModern
          ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
          : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
      }`}>
        📈 简历评分
      </h2>
      
      {/* 总分 */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-28 h-28 rounded-3xl shadow-xl ${
          overall >= 80
            ? isModern
              ? 'bg-gradient-to-br from-emerald-100 to-green-100'
              : 'bg-gradient-to-br from-emerald-900/30 to-green-900/30'
            : overall >= 60
              ? isModern
                ? 'bg-gradient-to-br from-amber-100 to-yellow-100'
                : 'bg-gradient-to-br from-amber-900/30 to-yellow-900/30'
              : isModern
                ? 'bg-gradient-to-br from-red-100 to-rose-100'
                : 'bg-gradient-to-br from-red-900/30 to-rose-900/30'
        }`}>
          <span className={`text-5xl font-extrabold ${
            overall >= 80
              ? isModern ? 'text-emerald-600' : 'text-emerald-400'
              : overall >= 60
                ? isModern ? 'text-amber-600' : 'text-amber-400'
                : isModern ? 'text-red-600' : 'text-red-400'
          }`}>
            {overall}
          </span>
        </div>
        <p className={`mt-3 text-lg font-medium ${
          isModern ? 'text-slate-600' : 'text-slate-400'
        }`}>综合评分</p>
      </div>

      {/* 分项评分 */}
      <div className="space-y-5">
        <ScoreItem
          label="完整度"
          score={completeness}
          description="教育、经历、技能等信息是否完整"
          {...getScoreColor(completeness)}
        />
        <ScoreItem
          label="规范性"
          score={formatting}
          description="格式、排版、结构是否规范"
          {...getScoreColor(formatting)}
        />
        <ScoreItem
          label="关键词匹配"
          score={keywords}
          description="与目标岗位的关键词匹配程度"
          {...getScoreColor(keywords)}
        />
      </div>
    </div>
  );
};

interface ScoreItemProps {
  label: string;
  score: number;
  description: string;
  bg: string;
  text: string;
}

const ScoreItem: React.FC<ScoreItemProps> = ({ label, score, description, bg, text }) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-semibold ${
          isModern ? 'text-slate-800' : 'text-slate-200'
        }`}>{label}</span>
        <div className="flex items-center gap-3">
          <span className={`font-extrabold ${
            score >= 80
              ? isModern ? 'text-emerald-600' : 'text-emerald-400'
              : score >= 60
                ? isModern ? 'text-amber-600' : 'text-amber-400'
                : isModern ? 'text-red-600' : 'text-red-400'
          }`}>{score}分</span>
          <span className={`text-xs px-3 py-1 rounded-full ${bg} text-white font-semibold shadow-lg`}>
            {score >= 80 ? '优秀' : score >= 60 ? '良好' : '需提升'}
          </span>
        </div>
      </div>
      <div className={`w-full rounded-full h-3 mb-2 ${
        isModern ? 'bg-slate-200' : 'bg-slate-700'
      }`}>
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${bg} shadow-lg`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className={`text-sm ${
        isModern ? 'text-slate-500' : 'text-slate-500'
      }`}>{description}</p>
    </div>
  );
};

export default ResumeScore;