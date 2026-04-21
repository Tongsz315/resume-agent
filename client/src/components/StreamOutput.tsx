import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts';
import LoadingSpinner from './LoadingSpinner';
import ResultDisplay from './ResultDisplay';

interface StreamOutputProps {
  isStreaming: boolean;
  progress: number;
  progressMessage: string;
  result: any;
  error?: string;
  onRetry?: () => void;
}

const StreamOutput: React.FC<StreamOutputProps> = ({
  isStreaming,
  progress,
  progressMessage,
  result,
  error,
  onRetry
}) => {
  const { isModern } = useTheme();
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isStreaming && Object.keys(result).length > 0) {
      setShowResult(true);
    }
  }, [isStreaming, result]);

  if (error) {
    return (
      <div className={`p-6 rounded-2xl border ${
        isModern
          ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50'
          : 'bg-gradient-to-br from-red-900/20 to-rose-900/20 border-red-800/30'
      }`}>
        <p className={`mb-4 font-semibold ${isModern ? 'text-red-700' : 'text-red-400'}`}>
          ❌ {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`px-5 py-2.5 rounded-xl font-semibold ${
              isModern
                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                : 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800/30'
            }`}
          >
            重试
          </button>
        )}
      </div>
    );
  }

  if (!isStreaming && !showResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      {isStreaming && (
        <div className={`rounded-3xl shadow-2xl p-6 ${
          isModern
            ? 'bg-white/80 backdrop-blur border border-slate-200/50'
            : 'bg-slate-900/80 backdrop-blur border border-slate-700/50'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <LoadingSpinner message="" />
            <div className="flex-1">
              <p className={`font-semibold ${isModern ? 'text-slate-700' : 'text-slate-200'}`}>
                {progressMessage}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className={`flex-1 h-3 rounded-full overflow-hidden ${
                  isModern ? 'bg-slate-200' : 'bg-slate-700'
                }`}>
                  <div
                    className={`h-full transition-all duration-300 ${
                      isModern
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        : 'bg-gradient-to-r from-purple-500 to-blue-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${isModern ? 'text-slate-500' : 'text-slate-400'}`}>
                  {progress}%
                </span>
              </div>
            </div>
          </div>

          {Object.keys(result).length > 0 && (
            <div className={`p-4 rounded-2xl border ${
              isModern
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-800 border-slate-700'
            }`}>
              <p className={`text-sm ${isModern ? 'text-slate-500' : 'text-slate-400'}`}>
                📄 结果正在生成中...
              </p>
            </div>
          )}
        </div>
      )}

      {showResult && <ResultDisplay result={result} onCopy={() => {}} onExport={() => {}} />}
    </div>
  );
};

export default StreamOutput;
