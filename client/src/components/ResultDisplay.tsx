import React from 'react';
import { useTheme, useLocale } from '../contexts';

interface ResultDisplayProps {
  result: any;
  onCopy: () => void;
  onExport: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onCopy, onExport }) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';
  const { t } = useLocale();

  return (
    <div className={`rounded-3xl shadow-2xl p-6 md:p-8 ${
      isModern
        ? 'bg-white/80 backdrop-blur border border-slate-200/50'
        : 'bg-slate-900/80 backdrop-blur border border-slate-700/50'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${
        isModern
          ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
          : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
      }`}>
        {t('matchAnalysis')}
      </h2>

      {/* 关键词匹配度 */}
      <div className="mb-7">
        <div className="flex justify-between mb-3">
          <span className={`font-semibold ${isModern ? 'text-slate-800' : 'text-slate-200'}`}>
            {t('keywordMatch')}
          </span>
          <span className={`font-extrabold text-lg ${
            result.keywordMatch >= 80
              ? isModern ? 'text-emerald-600' : 'text-emerald-400'
              : result.keywordMatch >= 60
                ? isModern ? 'text-amber-600' : 'text-amber-400'
                : isModern ? 'text-red-600' : 'text-red-400'
          }`}>
            {result.keywordMatch}%
          </span>
        </div>
        <div className={`h-4 rounded-full ${
          isModern ? 'bg-slate-200' : 'bg-slate-700'
        }`}>
          <div 
            className={`h-4 rounded-full transition-all duration-1000 shadow-lg ${
              result.keywordMatch >= 80
                ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                : result.keywordMatch >= 60
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}
            style={{ width: `${result.keywordMatch}%` }}
          />
        </div>
      </div>

      {/* 优劣势分析 */}
      <div className="grid md:grid-cols-2 gap-6 mb-7">
        {/* 优势 */}
        <div className={`rounded-2xl p-5 ${
          isModern
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50'
            : 'bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-800/30'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${
            isModern ? 'text-emerald-700' : 'text-emerald-400'
          }`}>
            {t('strengths')}
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((strength: string, index: number) => (
              <li key={index} className={`flex items-start ${
                isModern ? 'text-slate-800' : 'text-slate-300'
              }`}>
                <span className="text-emerald-500 mr-3 text-xl">✓</span>
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 待提升 */}
        <div className={`rounded-2xl p-5 ${
          isModern
            ? 'bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200/50'
            : 'bg-gradient-to-br from-rose-900/20 to-red-900/20 border border-rose-800/30'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${
            isModern ? 'text-rose-700' : 'text-rose-400'
          }`}>
            {t('weaknesses')}
          </h3>
          <ul className="space-y-3">
            {result.weaknesses.map((weakness: string, index: number) => (
              <li key={index} className={`flex items-start ${
                isModern ? 'text-slate-800' : 'text-slate-300'
              }`}>
                <span className="text-rose-500 mr-3 text-xl">!</span>
                <span className="leading-relaxed">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 匹配分析说明 */}
      {result.matchAnalysis && (
        <div className={`mb-7 p-5 rounded-2xl ${
          isModern
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50'
            : 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${
            isModern ? 'text-blue-700' : 'text-blue-400'
          }`}>
            详细分析
          </h3>
          <p className={`leading-relaxed ${
            isModern ? 'text-slate-800' : 'text-slate-300'
          }`}>
            {result.matchAnalysis}
          </p>
        </div>
      )}

      {/* 定制化自我介绍 */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold ${
            isModern
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
              : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
          }`}>
            {t('selfIntroduction')}
          </h3>
          <button
            onClick={onCopy}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
              isModern
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            📋 复制
          </button>
        </div>
        <div className={`p-5 rounded-2xl ${
          isModern ? 'bg-slate-50' : 'bg-slate-800'
        }`}>
          <p className={`leading-relaxed ${
            isModern ? 'text-slate-800' : 'text-slate-300'
          }`}>
            {result.selfIntroduction}
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onExport}
          className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${
            isModern
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]'
              : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]'
          }`}
        >
          📊 {t('export')}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
