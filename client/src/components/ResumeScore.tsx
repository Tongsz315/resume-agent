import React from 'react';

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
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-600', label: '优秀' };
    if (score >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-600', label: '良好' };
    return { bg: 'bg-red-500', text: 'text-red-600', label: '需提升' };
  };

  const overall = Math.round((completeness + formatting + keywords) / 3);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📈 简历评分
      </h2>
      
      {/* 总分 */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
          overall >= 80 ? 'bg-green-100' : overall >= 60 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <span className={`text-4xl font-bold ${
            overall >= 80 ? 'text-green-600' : overall >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {overall}
          </span>
        </div>
        <p className="mt-2 text-gray-600">综合评分</p>
      </div>

      {/* 分项评分 */}
      <div className="space-y-4">
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

const ScoreItem: React.FC<ScoreItemProps> = ({ label, score, description, bg, text }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-bold ${text}`}>{score}分</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${bg} text-white`}>
          {score >= 80 ? '优秀' : score >= 60 ? '良好' : '需提升'}
        </span>
      </div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${bg}`}
        style={{ width: `${score}%` }}
      />
    </div>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

export default ResumeScore;