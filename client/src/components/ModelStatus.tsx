import React, { useState, useEffect } from 'react';
import { useTheme, useLocale } from '../contexts';

interface ModelStatusResponse {
  success: boolean;
  model: string;
  hasApiKey: boolean;
  status: string;
}

const ModelStatus: React.FC = () => {
  const { isModern } = useTheme();
  const { t } = useLocale();
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [modelName, setModelName] = useState<string>('Unknown');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const checkModelStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          const data: ModelStatusResponse = await response.json();
          if (mounted) {
            if (data.success) {
              setStatus('connected');
              setModelName(data.model);
              setHasApiKey(data.hasApiKey);
            } else {
              setStatus('error');
            }
          }
        } else {
          if (mounted) setStatus('error');
        }
      } catch {
        if (mounted) setStatus('error');
      }
    };

    checkModelStatus();
    const interval = setInterval(checkModelStatus, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const getStatusText = () => {
    if (status === 'loading') return 'Checking...';
    if (status === 'connected') {
      if (!hasApiKey) return 'No API Key';
      return 'Connected';
    }
    return 'Disconnected';
  };

  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-2xl shadow-xl z-40 ${
      isModern
        ? 'bg-white/90 backdrop-blur border border-slate-200/50'
        : 'bg-slate-900/90 backdrop-blur border border-slate-700/50'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          status === 'connected' && hasApiKey
            ? 'bg-emerald-500'
            : status === 'loading'
              ? 'bg-amber-500 animate-pulse'
              : 'bg-red-500'
        }`} />
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${isModern ? 'text-slate-700' : 'text-slate-300'}`}>
            {getStatusText()}
          </span>
          <span className={`text-xs ${isModern ? 'text-slate-500' : 'text-slate-500'}`}>
            {modelName}
          </span>
          {!hasApiKey && status === 'connected' && (
            <span className="text-xs text-red-500 mt-1">
              请配置 API Key
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelStatus;
