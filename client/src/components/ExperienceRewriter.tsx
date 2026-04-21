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
  const { theme } = useTheme();
  const isModern = theme === 'modern';
  const { showToast } = useToast();
  const { copy } = useCopyToClipboard();
  const [experienceText, setExperienceText] = useState(defaultExperience || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [refining, setRefining] = useState<{ [key: string]: boolean }>({});

  const handleRewrite = async () => {
    if (!experienceText.trim() || !jdText.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post('/api/rewrite', {
        originalText: experienceText,
        jdText,
        rewriteType: 'experience'
      });
      if (res.data.success) {
        setResult(res.data);
      }
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
      if (res.data.success && result) {
        setResult(prev => prev ? {
          ...prev,
          [key]: res.data.refinedText
        } : null);
      }
    } catch (error) {
      console.error('二次优化失败', error);
    } finally {
      setRefining(prev => ({ ...prev, [key]: false }));
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
        ✨ 经历改写
      </h2>

      {!result ? (
        <>
          <div className="mb-6">
            <label className={`block mb-3 font-semibold ${isModern ? 'text-slate-800' : 'text-slate-200'}`}>
              输入要改写的经历
            </label>
            <textarea
              value={experienceText}
              onChange={(e) => setExperienceText(e.target.value)}
              placeholder="例如：在公司负责项目推进，协助团队完成任务..."
              className={`w-full p-5 rounded-2xl border-2 resize-none h-36 transition-all ${
                isModern 
                ? 'bg-white text-slate-800 border-slate-200 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100' 
                : 'bg-slate-800 text-slate-200 border-slate-700 placeholder-slate-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-900/30'
              } focus:outline-none`}
            />
          </div>
          <button
            onClick={handleRewrite}
            disabled={isLoading || !experienceText.trim() || !jdText.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              isLoading || !experienceText.trim() || !jdText.trim()
                ? (isModern ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-800 text-slate-500 cursor-not-allowed')
                : isModern
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]'
                : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]'
            }`}
          >
            {isLoading ? <LoadingSpinner message="正在改写..." /> : '开始改写'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-7">
            <h3 className={`text-lg font-bold mb-4 ${
              isModern
                ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
                : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
            }`}>
              📝 优化说明
            </h3>
            <p className={`p-5 rounded-2xl ${
              isModern
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 text-slate-800'
                : 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30 text-slate-300'
            }`}>
              {result.rewriteReason}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-7">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${isModern ? 'text-green-700' : 'text-green-400'}`}>
                  版本一：保守优化
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(result.rewrittenTextBasic)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isModern
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    复制
                  </button>
                  <button
                    onClick={() => handleRefine(result.rewrittenTextBasic, 'more-concise', 'rewrittenTextBasic')}
                    disabled={refining['rewrittenTextBasic']}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isModern
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {refining['rewrittenTextBasic'] ? '...' : '更简洁'}
                  </button>
                </div>
              </div>
              <div className={`p-5 rounded-2xl ${
                isModern
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 text-slate-800'
                  : 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800/30 text-slate-300'
              }`}>
                {result.rewrittenTextBasic}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${isModern ? 'text-purple-700' : 'text-purple-400'}`}>
                  版本二：更强表达
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(result.rewrittenTextAdvanced)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isModern
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    复制
                  </button>
                  <button
                    onClick={() => handleRefine(result.rewrittenTextAdvanced, 'more-interview', 'rewrittenTextAdvanced')}
                    disabled={refining['rewrittenTextAdvanced']}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isModern
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {refining['rewrittenTextAdvanced'] ? '...' : '更适合面试'}
                  </button>
                </div>
              </div>
              <div className={`p-5 rounded-2xl ${
                isModern
                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/50 text-slate-800'
                  : 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-800/30 text-slate-300'
              }`}>
                {result.rewrittenTextAdvanced}
              </div>
            </div>
          </div>

          <FeedbackButtons
            contentType="rewrite"
            content={result.rewrittenTextBasic}
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
            改写另一段经历
          </button>
        </>
      )}
    </div>
  );
};

export default ExperienceRewriter;
