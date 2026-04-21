import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, onDismiss }) => {
  const { isDark } = useTheme();

  return (
    <div className={`mb-4 p-4 rounded-xl border flex items-center justify-between gap-4 ${
      isDark
        ? 'bg-red-900/30 border-red-700 text-red-300'
        : 'bg-red-50 border-red-200 text-red-600'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <span className="flex-1">{message}</span>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
          >
            🔄 重试
          </button>
        )}
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/20 rounded"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorBanner;