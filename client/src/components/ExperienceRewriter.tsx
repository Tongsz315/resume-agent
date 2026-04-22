import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts';
import LoadingSpinner from './LoadingSpinner';
import FeedbackButtons from './FeedbackButtons';
import { useToast } from './Toast';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface ExperienceRewriterProps {
  jdText: string;
  defaultExperience?: string;
}

interface RewriteResult {
  originalText: string;
  rewrittenTextBasic: string;
  rewrittenTextAdvanced: string;
  rewriteReason: string;
}

const ExperienceRewriter: React.FC<ExperienceRewriterProps> = ({ jdText, defaultExperience }) => {
  const { isDark } = useTheme();
  const [experienceText, setExperienceText] = useState(defaultExperience || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [refining, setRefining] = useState<{ [key: string]: boolean }>({});
  const { showToast } = useToast();
  const { copy } = useCopyToClipboard();

  const handleRewrite = async () => {
    if (!experienceText.trim() || !jdText.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post('/api/rewrite', { originalText: experienceText, jdText, rewriteType: 'experience' });
      if (res.data.success) setResult(res.data);
    } catch (error) {
      console.error('改写失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async (text: string, goal: string, key: string) => {
    setRefining(prev => ({ ...prev, [key]: true }));
    try {
      const res = await axios.post('/api/refine', { text, goal });
      if (res.data.success && result) setResult(prev => prev ? { ...prev, [key]: res.data.refinedText } : null);
    } catch (error) {
      console.error('二次优化失败', error);
    } finally {
      setRefining(prev => ({ ...prev, [key]: false }));
    }
  };

  const copyToClipboard = async (text: string) => {
    const ok = await copy(text);
    showToast(ok ? '已复制' : '复制失败', ok ? 'success' : 'error');
  };

  const cardClass = `rounded-2xl p-6 md:p-8 transition-colors ${isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.06)]' : 'bg-white border border-[rgba(0,0,0,0.04)]'}`;
  const btnClass = `px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-[rgba(255,255,255,0.08)] text-[#2997ff]' : 'bg-[#f5f5f7] text-[#0071e3]'}`;

  return (
    <div className={cardClass}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>经历改写</h2>

      {!result ? (
        <>
          <div className="mb-6">
            <label className={`block mb-2 text-sm font-semibold ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>输入要改写的经历</label>
            <textarea
              value={experienceText}
              onChange={(e) => setExperienceText(e.target.value)}
              placeholder="例如：在公司负责项目推进，协助团队完成任务..."
              className={`w-full p-4 rounded-xl border resize-none h-32 text-sm transition-all focus:outline-none focus:ring-2 ${
                isDark ? 'bg-[#2d2d2f] border-[rgba(255,255,255,0.06)] text-white placeholder-[#6e6e73] focus:border-[#2997ff] focus:ring-[#2997ff]/20'
                  : 'bg-white border-[rgba(0,0,0,0.08)] text-[#1d1d1f] placeholder-[#86868b] focus:border-[#0071e3] focus:ring-[#0071e3]/20'
              }`}
            />
          </div>
          <button
            onClick={handleRewrite}
            disabled={isLoading || !experienceText.trim() || !jdText.trim()}
            className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all ${isLoading || !experienceText.trim() || !jdText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
            style={{ background: isDark ? '#2997ff' : '#0071e3' }}
          >
            {isLoading ? <LoadingSpinner message="正在改写..." /> : '开始改写'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-6 p-4 rounded-xl" style={{ background: isDark ? 'rgba(41,151,255,0.08)' : 'rgba(0,113,227,0.05)' }}>
            <p className={`text-sm ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>{result.rewriteReason}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-sm font-semibold ${isDark ? 'text-[#30d158]' : 'text-[#34c759]'}`}>保守优化</h3>
                <div className="flex gap-1.5">
                  <button onClick={() => copyToClipboard(result.rewrittenTextBasic)} className={btnClass}>复制</button>
                  <button onClick={() => handleRefine(result.rewrittenTextBasic, 'more-concise', 'rewrittenTextBasic')} disabled={refining['rewrittenTextBasic']} className={btnClass}>
                    {refining['rewrittenTextBasic'] ? '...' : '更简洁'}
                  </button>
                </div>
              </div>
              <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-[rgba(48,209,88,0.06)] text-[#a1a1a6]' : 'bg-[rgba(52,199,89,0.04)] text-[#6e6e73]'}`}>
                {result.rewrittenTextBasic}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-sm font-semibold ${isDark ? 'text-[#ff9f0a]' : 'text-[#ff9f0a]'}`}>更强表达</h3>
                <div className="flex gap-1.5">
                  <button onClick={() => copyToClipboard(result.rewrittenTextAdvanced)} className={btnClass}>复制</button>
                  <button onClick={() => handleRefine(result.rewrittenTextAdvanced, 'more-interview', 'rewrittenTextAdvanced')} disabled={refining['rewrittenTextAdvanced']} className={btnClass}>
                    {refining['rewrittenTextAdvanced'] ? '...' : '适合面试'}
                  </button>
                </div>
              </div>
              <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-[rgba(255,159,10,0.06)] text-[#a1a1a6]' : 'bg-[rgba(255,159,10,0.04)] text-[#6e6e73]'}`}>
                {result.rewrittenTextAdvanced}
              </div>
            </div>
          </div>

          <FeedbackButtons contentType="rewrite" content={result.rewrittenTextBasic} onRegenerate={() => setResult(null)} />
          <button onClick={() => setResult(null)} className={`mt-4 w-full py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-[rgba(255,255,255,0.06)] text-[#a1a1a6]' : 'bg-[#f5f5f7] text-[#6e6e73]'}`}>
            改写另一段经历
          </button>
        </>
      )}
    </div>
  );
};

export default ExperienceRewriter;
