import React from 'react';
import { useTheme } from '../contexts';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, onDismiss }) => {
  const { isDark } = useTheme();

  return (
    <div className={`mb-6 p-4 rounded-xl flex items-center justify-between gap-4 slide-down ${
      isDark ? 'bg-[rgba(255,69,58,0.1)] text-[#ff453a]' : 'bg-[rgba(255,59,48,0.08)] text-[#ff3b30]'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">⚠️</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button onClick={onRetry} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
            isDark ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[rgba(255,59,48,0.1)]'
          }`}>
            重试
          </button>
        )}
        <button onClick={onDismiss} className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorBanner;
