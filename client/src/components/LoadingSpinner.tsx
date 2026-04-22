import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => (
  <div className="flex items-center justify-center gap-3">
    <div className="loading-spinner" />
    {message && <span className="text-sm font-medium">{message}</span>}
  </div>
);

export default LoadingSpinner;
