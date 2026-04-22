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
    <div className={`rounded-2xl p-6 md:p-8 transition-colors ${
      isDark
        ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.06)]'
        : 'bg-white border border-[rgba(0,0,0,0.04)]'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
        {t('matchAnalysis')}
      </h2>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className={`text-sm font-medium ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>
            {t('keywordMatch')}
          </span>
          <span className={`text-lg font-bold ${
            result.keywordMatch >= 80
              ? isDark ? 'text-[#30d158]' : 'text-[#34c759]'
              : result.keywordMatch >= 60
                ? isDark ? 'text-[#ff9f0a]' : 'text-[#ff9f0a]'
                : isDark ? 'text-[#ff453a]' : 'text-[#ff3b30]'
          }`}>
            {result.keywordMatch}%
          </span>
        </div>
        <div className={`h-2 rounded-full ${isDark ? 'bg-[rgba(255,255,255,0.08)]' : 'bg-[rgba(0,0,0,0.06)]'}`}>
          <div
            className={`h-2 rounded-full transition-all duration-700 ${
              result.keywordMatch >= 80
                ? isDark ? 'bg-[#30d158]' : 'bg-[#34c759]'
                : result.keywordMatch >= 60
                  ? 'bg-[#ff9f0a]'
                  : isDark ? 'bg-[#ff453a]' : 'bg-[#ff3b30]'
            }`}
            style={{ width: `${result.keywordMatch}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className={`rounded-xl p-5 ${isDark ? 'bg-[rgba(48,209,88,0.08)]' : 'bg-[rgba(52,199,89,0.06)]'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-[#30d158]' : 'text-[#34c759]'}`}>
            {t('strengths')}
          </h3>
          <ul className="space-y-2.5">
            {result.strengths.map((s: string, i: number) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>
                <span className={isDark ? 'text-[#30d158]' : 'text-[#34c759]'}>✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`rounded-xl p-5 ${isDark ? 'bg-[rgba(255,69,58,0.08)]' : 'bg-[rgba(255,59,48,0.06)]'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-[#ff453a]' : 'text-[#ff3b30]'}`}>
            {t('weaknesses')}
          </h3>
          <ul className="space-y-2.5">
            {result.weaknesses.map((w: string, i: number) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>
                <span className={isDark ? 'text-[#ff453a]' : 'text-[#ff3b30]'}>!</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {result.matchAnalysis && (
        <div className={`mb-8 p-5 rounded-xl ${isDark ? 'bg-[rgba(41,151,255,0.08)]' : 'bg-[rgba(0,113,227,0.05)]'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-[#2997ff]' : 'text-[#0071e3]'}`}>详细分析</h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>{result.matchAnalysis}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>{t('selfIntroduction')}</h3>
          <button
            onClick={onCopy}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
              isDark ? 'bg-[rgba(255,255,255,0.08)] text-[#2997ff]' : 'bg-[#f5f5f7] text-[#0071e3]'
            }`}
          >
            复制
          </button>
        </div>
        <div className={`p-5 rounded-xl ${isDark ? 'bg-[rgba(255,255,255,0.04)]' : 'bg-[#f5f5f7]'}`}>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>{result.selfIntroduction}</p>
        </div>
      </div>

      <button
        onClick={onExport}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{ background: isDark ? '#2997ff' : '#0071e3' }}
      >
        📊 {t('export')}
      </button>
    </div>
  );
};

export default ResultDisplay;
