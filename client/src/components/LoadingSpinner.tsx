import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = '处理中...' }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <span className="loading-spinner w-5 h-5"></span>
      <span>{message}</span>
    </div>
  );
};

export default LoadingSpinner;