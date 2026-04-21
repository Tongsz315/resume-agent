import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts';
import LoadingSpinner from './LoadingSpinner';
import FeedbackButtons from './FeedbackButtons';

interface ProjectOptimizerProps {
  jdText: string;
  defaultProject?: string;
}

interface OptimizeResult {
  projectIntro: string;
  personalContribution: string;
  starVersion: string;
  quantizationTips: string[];
}

const ProjectOptimizer: React.FC<ProjectOptimizerProps> = ({ jdText, defaultProject }) => {
  const { isDark } = useTheme();
  const [projectText, setProjectText] = useState(defaultProject || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);

  const handleOptimize = async () => {
    if (!projectText.trim() || !jdText.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post('/api/project-optimize', { projectText, jdText });
      if (res.data.success) {
        setResult(res.data);
      }
    } catch (error) {
      console.error('项目优化失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板！');
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-indigo-700'}`}>
        🚀 项目优化
      </h2>

      {!result ? (
        <>
          <div className="mb-4">
            <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              输入项目描述
            </label>
            <textarea
              value={projectText}
              onChange={(e) => setProjectText(e.target.value)}
              placeholder="例如：开发了一个管理系统，负责前端开发..."
              className={`w-full p-4 rounded-xl border-2 resize-none h-32 ${
                isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              } focus:outline-none focus:border-indigo-500`}
            />
          </div>
          <button
            onClick={handleOptimize}
            disabled={isLoading || !projectText.trim() || !jdText.trim()}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
              isLoading || !projectText.trim() || !jdText.trim()
                ? (isDark ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-200 cursor-not-allowed')
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? <LoadingSpinner message="正在优化..." /> : '开始优化'}
          </button>
        </>
      ) : (
        <>
          {result.quantizationTips.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <h3 className="text-yellow-800 font-semibold mb-2">💡 量化建议</h3>
              <ul className="list-disc pl-5 text-yellow-800">
                {result.quantizationTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-6 mb-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  1️⃣ 项目简介
                </h3>
                <button
                  onClick={() => copyToClipboard(result.projectIntro)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  复制
                </button>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {result.projectIntro}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                  2️⃣ 个人贡献
                </h3>
                <button
                  onClick={() => copyToClipboard(result.personalContribution)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  复制
                </button>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-green-50'} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {result.personalContribution}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                  3️⃣ STAR 面试版
                </h3>
                <button
                  onClick={() => copyToClipboard(result.starVersion)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  复制
                </button>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-purple-50'} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {result.starVersion}
              </div>
            </div>
          </div>

          <FeedbackButtons
            contentType="rewrite"
            content={result.starVersion}
            onRegenerate={() => setResult(null)}
          />

          <button
            onClick={() => setResult(null)}
            className={`mt-4 w-full py-2 rounded-xl font-medium ${
              isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            优化另一个项目
          </button>
        </>
      )}
    </div>
  );
};

export default ProjectOptimizer;
