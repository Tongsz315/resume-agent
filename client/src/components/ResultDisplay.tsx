import React from 'react';
import { useTheme, useLocale } from '../contexts';

interface ResultDisplayProps {
  result: any;
  onCopy: () => void;
  onExport: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onCopy, onExport }) => {
  const { isDark } = useTheme();
  const { t } = useLocale();

  return (
    <div className={`rounded-2xl shadow-lg p-6 md:p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-indigo-700'}`}>
        {t('matchAnalysis')}
      </h2>

      {/* 关键词匹配度 */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('keywordMatch')}
          </span>
          <span className={`font-bold ${result.keywordMatch >= 80 ? 'text-green-500' : result.keywordMatch >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
            {result.keywordMatch}%
          </span>
        </div>
        <div className={`h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${result.keywordMatch >= 80 ? 'bg-green-500' : result.keywordMatch >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${result.keywordMatch}%` }}
          />
        </div>
      </div>

      {/* 优劣势分析 */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* 优势 */}
        <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
            {t('strengths')}
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((strength: string, index: number) => (
              <li key={index} className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-green-500 mr-2">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 待提升 */}
        <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700' : 'bg-red-50'}`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
            {t('weaknesses')}
          </h3>
          <ul className="space-y-2">
            {result.weaknesses.map((weakness: string, index: number) => (
              <li key={index} className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-red-500 mr-2">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 匹配分析说明 */}
      {result.matchAnalysis && (
        <div className={`mb-6 p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
            详细分析
          </h3>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {result.matchAnalysis}
          </p>
        </div>
      )}

      {/* 定制化自我介绍 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-indigo-700'}`}>
            {t('selfIntroduction')}
          </h3>
          <button
            onClick={onCopy}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
          >
            📋 复制
          </button>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {result.selfIntroduction}
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onExport}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
        >
          📊 {t('export')}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
