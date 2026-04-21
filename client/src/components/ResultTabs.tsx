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
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('analysis');

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'analysis', label: '匹配分析', icon: '📊' },
    { key: 'intro', label: '自我介绍', icon: '👋' },
    { key: 'rewrite', label: '经历改写', icon: '✨' },
    { key: 'project', label: '项目优化', icon: '🚀' }
  ];

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-lg'
                : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
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
          <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-indigo-700'}`}>
                👋 定制化自我介绍
              </h2>
              <button
                onClick={onCopyIntro}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                📋 复制
              </button>
            </div>
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
