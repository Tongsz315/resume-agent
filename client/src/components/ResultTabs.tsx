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

const ResultTabs: React.FC<ResultTabsProps> = ({ 
  result, 
  jdText, 
  onCopyIntro, 
  onExport, 
  resumeText 
}) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';
  const [activeTab, setActiveTab] = useState<TabType>('analysis');

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'analysis', label: '匹配分析', icon: '📊' },
    { key: 'intro', label: '自我介绍', icon: '👋' },
    { key: 'rewrite', label: '经历改写', icon: '✨' },
    { key: 'project', label: '项目优化', icon: '🚀' }
  ];

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 rounded-2xl font-semibold transition-all ${
              activeTab === tab.key
                ? isModern
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl'
                  : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl'
                : isModern
                  ? 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 shadow-lg'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'analysis' && (
          <ResultDisplay 
            result={result} 
            onCopy={onCopyIntro} 
            onExport={onExport} 
          />
        )}

        {activeTab === 'intro' && (
          <div className={`rounded-3xl shadow-2xl p-6 ${
            isModern
              ? 'bg-white/80 backdrop-blur border border-slate-200/50'
              : 'bg-slate-900/80 backdrop-blur border border-slate-700/50'
          }`}>
            <div className="flex justify-between items-center mb-5">
              <h2 className={`text-2xl font-bold ${
                isModern
                  ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
              }`}>
                👋 定制化自我介绍
              </h2>
              <button
                onClick={onCopyIntro}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                  isModern
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                📋 复制
              </button>
            </div>
            <div className={`p-6 rounded-2xl ${
              isModern ? 'bg-slate-50' : 'bg-slate-800'
            }`}>
              <p className={`text-lg leading-relaxed ${
                isModern ? 'text-slate-800' : 'text-slate-300'
              }`}>
                {result.selfIntroduction}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'rewrite' && (
          <ExperienceRewriter 
            jdText={jdText} 
            defaultExperience="" 
          />
        )}

        {activeTab === 'project' && (
          <ProjectOptimizer 
            jdText={jdText} 
            defaultProject="" 
          />
        )}
      </div>
    </div>
  );
};

export default ResultTabs;
