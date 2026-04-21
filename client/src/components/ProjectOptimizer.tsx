import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts';
import LoadingSpinner from './LoadingSpinner';
import FeedbackButtons from './FeedbackButtons';
import { useToast } from './Toast';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

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
  const { theme } = useTheme();
  const isModern = theme === 'modern';
  const { showToast } = useToast();
  const { copy } = useCopyToClipboard();
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

  const copyToClipboard = async (text: string) => {
    const ok = await copy(text);
    showToast(ok ? '已复制到剪贴板' : '复制失败', ok ? 'success' : 'error');
  };

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
        🚀 项目优化
      </h2>

      {!result ? (
        <>
          <div className="mb-6">
            <label className={`block mb-3 font-semibold ${isModern ? 'text-slate-800' : 'text-slate-200'}`}>
              输入项目描述
            </label>
            <textarea
              value={projectText}
              onChange={(e) => setProjectText(e.target.value)}
              placeholder="例如：开发了一个管理系统，负责前端开发..."
              className={`w-full p-5 rounded-2xl border-2 resize-none h-36 transition-all ${
                isModern 
                ? 'bg-white text-slate-800 border-slate-200 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100' 
                : 'bg-slate-800 text-slate-200 border-slate-700 placeholder-slate-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-900/30'
              } focus:outline-none`}
            />
          </div>
          <button
            onClick={handleOptimize}
            disabled={isLoading || !projectText.trim() || !jdText.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              isLoading || !projectText.trim() || !jdText.trim()
                ? (isModern ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-800 text-slate-500 cursor-not-allowed')
                : isModern
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]'
                : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]'
            }`}
          >
            {isLoading ? <LoadingSpinner message="正在优化..." /> : '开始优化'}
          </button>
        </>
      ) : (
        <>
          {result.quantizationTips.length > 0 && (
            <div className="mb-7 p-5 rounded-2xl border ${
              isModern
                ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200/50'
                : 'bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border-amber-800/30'
            }">
              <h3 className={`font-bold mb-4 ${isModern ? 'text-amber-700' : 'text-amber-400'}`}>💡 量化建议</h3>
              <ul className={`space-y-2 ${isModern ? 'text-slate-800' : 'text-slate-300'}`}>
                {result.quantizationTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-6 mb-7">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${isModern ? 'text-blue-700' : 'text-blue-400'}`}>
                  1️⃣ 项目简介
                </h3>
                <button
                  onClick={() => copyToClipboard(result.projectIntro)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isModern
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  复制
                </button>
              </div>
              <div className={`p-5 rounded-2xl ${
                isModern
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 text-slate-800'
                  : 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30 text-slate-300'
              }`}>
                {result.projectIntro}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${isModern ? 'text-green-700' : 'text-green-400'}`}>
                  2️⃣ 个人贡献
                </h3>
                <button
                  onClick={() => copyToClipboard(result.personalContribution)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isModern
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  复制
                </button>
              </div>
              <div className={`p-5 rounded-2xl ${
                isModern
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 text-slate-800'
                  : 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800/30 text-slate-300'
              }`}>
                {result.personalContribution}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${isModern ? 'text-purple-700' : 'text-purple-400'}`}>
                  3️⃣ STAR 面试版
                </h3>
                <button
                  onClick={() => copyToClipboard(result.starVersion)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isModern
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  复制
                </button>
              </div>
              <div className={`p-5 rounded-2xl ${
                isModern
                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/50 text-slate-800'
                  : 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-800/30 text-slate-300'
              }`}>
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
            className={`mt-6 w-full py-3 rounded-2xl font-semibold transition-all ${
              isModern
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
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
