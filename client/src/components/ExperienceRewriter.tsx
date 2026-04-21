import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts';
import LoadingSpinner from './LoadingSpinner';
import FeedbackButtons from './FeedbackButtons';

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板！');
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-indigo-700'}`}>
        ✨ 经历改写
      </h2>

      {!result ? (
        <>
          <div className="mb-4">
            <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              输入要改写的经历
            </label>
            <textarea
              value={experienceText}
              onChange={(e) => setExperienceText(e.target.value)}
              placeholder="例如：在公司负责项目推进，协助团队完成任务..."
              className={`w-full p-4 rounded-xl border-2 resize-none h-32 ${
                isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              } focus:outline-none focus:border-indigo-500`}
            />
          </div>
          <button
            onClick={handleRewrite}
            disabled={isLoading || !experienceText.trim() || !jdText.trim()}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
              isLoading || !experienceText.trim() || !jdText.trim()
                ? (isDark ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-200 cursor-not-allowed')
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? <LoadingSpinner message="正在改写..." /> : '开始改写'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              📝 优化说明
            </h3>
            <p className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {result.rewriteReason}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                  版本一：保守优化
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(result.rewrittenTextBasic)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    复制
                  </button>
                  <button
                    onClick={() => handleRefine(result.rewrittenTextBasic, 'more-concise', 'rewrittenTextBasic')}
                    disabled={refining['rewrittenTextBasic']}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {refining['rewrittenTextBasic'] ? '...' : '更简洁'}
                  </button>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-green-50'} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {result.rewrittenTextBasic}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                  版本二：更强表达
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(result.rewrittenTextAdvanced)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    复制
                  </button>
                  <button
                    onClick={() => handleRefine(result.rewrittenTextAdvanced, 'more-interview', 'rewrittenTextAdvanced')}
                    disabled={refining['rewrittenTextAdvanced']}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {refining['rewrittenTextAdvanced'] ? '...' : '更适合面试'}
                  </button>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-purple-50'} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
            className={`mt-4 w-full py-2 rounded-xl font-medium ${
              isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
