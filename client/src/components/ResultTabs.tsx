import React, { useState } from 'react';
import { useTheme } from '../contexts';
import ResultDisplay from './ResultDisplay';
import ExperienceRewriter from './ExperienceRewriter';
import ProjectOptimizer from './ProjectOptimizer';

interface ResultTabsProps {
  result: any;
  jdText: string;
  onCopyIntro: () => void;
  onExport: () => void;
  resumeText: string;
}

type TabType = 'analysis' | 'intro' | 'rewrite' | 'project';

const ResultTabs: React.FC<ResultTabsProps> = ({ result, jdText, onCopyIntro, onExport, resumeText: _resumeText }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('analysis');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'analysis', label: '匹配分析' },
    { key: 'intro', label: '自我介绍' },
    { key: 'rewrite', label: '经历改写' },
    { key: 'project', label: '项目优化' },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-6 p-1 rounded-xl inline-flex" style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? isDark ? 'bg-[#2997ff] text-white shadow-lg' : 'bg-white text-[#1d1d1f] shadow-sm'
                : isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'analysis' && <ResultDisplay result={result} onCopy={onCopyIntro} onExport={onExport} />}
        {activeTab === 'intro' && (
          <div className={`rounded-2xl p-6 md:p-8 transition-colors ${
            isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.06)]' : 'bg-white border border-[rgba(0,0,0,0.04)]'
          }`}>
            <div className="flex justify-between items-center mb-5">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>定制化自我介绍</h2>
              <button
                onClick={onCopyIntro}
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
        )}
        {activeTab === 'rewrite' && <ExperienceRewriter jdText={jdText} defaultExperience="" />}
        {activeTab === 'project' && <ProjectOptimizer jdText={jdText} defaultProject="" />}
      </div>
    </div>
  );
};

export default ResultTabs;
