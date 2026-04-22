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
  const { isDark } = useTheme();
  const [projectText, setProjectText] = useState(defaultProject || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const { showToast } = useToast();
  const { copy } = useCopyToClipboard();

  const handleOptimize = async () => {
    if (!projectText.trim() || !jdText.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post('/api/project-optimize', { projectText, jdText });
      if (res.data.success) setResult(res.data);
    } catch (error) {
      console.error('项目优化失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    const ok = await copy(text);
    showToast(ok ? '已复制' : '复制失败', ok ? 'success' : 'error');
  };

  const cardClass = `rounded-2xl p-6 md:p-8 transition-colors ${isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.06)]' : 'bg-white border border-[rgba(0,0,0,0.04)]'}`;
  const btnClass = `px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-[rgba(255,255,255,0.08)] text-[#2997ff]' : 'bg-[#f5f5f7] text-[#0071e3]'}`;

  const sections = result ? [
    { title: '项目简介', content: result.projectIntro, color: isDark ? '#2997ff' : '#0071e3' },
    { title: '个人贡献', content: result.personalContribution, color: isDark ? '#30d158' : '#34c759' },
    { title: 'STAR 面试版', content: result.starVersion, color: isDark ? '#ff9f0a' : '#ff9f0a' },
  ] : [];

  return (
    <div className={cardClass}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>项目优化</h2>

      {!result ? (
        <>
          <div className="mb-6">
            <label className={`block mb-2 text-sm font-semibold ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>输入项目描述</label>
            <textarea
              value={projectText}
              onChange={(e) => setProjectText(e.target.value)}
              placeholder="例如：开发了一个管理系统，负责前端开发..."
              className={`w-full p-4 rounded-xl border resize-none h-32 text-sm transition-all focus:outline-none focus:ring-2 ${
                isDark ? 'bg-[#2d2d2f] border-[rgba(255,255,255,0.06)] text-white placeholder-[#6e6e73] focus:border-[#2997ff] focus:ring-[#2997ff]/20'
                  : 'bg-white border-[rgba(0,0,0,0.08)] text-[#1d1d1f] placeholder-[#86868b] focus:border-[#0071e3] focus:ring-[#0071e3]/20'
              }`}
            />
          </div>
          <button
            onClick={handleOptimize}
            disabled={isLoading || !projectText.trim() || !jdText.trim()}
            className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all ${isLoading || !projectText.trim() || !jdText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
            style={{ background: isDark ? '#2997ff' : '#0071e3' }}
          >
            {isLoading ? <LoadingSpinner message="正在优化..." /> : '开始优化'}
          </button>
        </>
      ) : (
        <>
          {result.quantizationTips.length > 0 && (
            <div className="mb-6 p-4 rounded-xl" style={{ background: isDark ? 'rgba(255,159,10,0.08)' : 'rgba(255,159,10,0.06)' }}>
              <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-[#ff9f0a]' : 'text-[#ff9f0a]'}`}>量化建议</h3>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>
                {result.quantizationTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-[#ff9f0a]">•</span>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-5 mb-6">
            {sections.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold" style={{ color: s.color }}>{s.title}</h3>
                  <button onClick={() => copyToClipboard(s.content)} className={btnClass}>复制</button>
                </div>
                <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-[rgba(255,255,255,0.04)] text-[#a1a1a6]' : 'bg-[#f5f5f7] text-[#6e6e73]'}`}>
                  {s.content}
                </div>
              </div>
            ))}
          </div>

          <FeedbackButtons contentType="rewrite" content={result.starVersion} onRegenerate={() => setResult(null)} />
          <button onClick={() => setResult(null)} className={`mt-4 w-full py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-[rgba(255,255,255,0.06)] text-[#a1a1a6]' : 'bg-[#f5f5f7] text-[#6e6e73]'}`}>
            优化另一个项目
          </button>
        </>
      )}
    </div>
  );
};

export default ProjectOptimizer;
