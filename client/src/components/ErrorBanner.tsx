import React from 'react';
import { useTheme } from '../contexts';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, onDismiss }) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';

  return (
    <div className={`mb-6 p-5 rounded-2xl border flex items-center justify-between gap-5 ${
      isModern
        ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200/50 text-red-700 shadow-lg'
        : 'bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-800/30 text-red-300 shadow-lg'
    }`}>
      <div className="flex items-center gap-4">
        <span className="text-3xl">⚠️</span>
        <span className="flex-1 font-medium">{message}</span>
      </div>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              isModern
                ? 'bg-white/60 hover:bg-white/80 text-red-700 border border-red-200/50'
                : 'bg-white/20 hover:bg-white/30 text-red-300'
            }`}
          >
            🔄 重试
          </button>
        )}
        <button
          onClick={onDismiss}
          className={`p-2 rounded-xl hover:bg-white/20 transition-all ${
            isModern ? 'text-red-600 hover:bg-red-100/50' : ''
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorBanner;