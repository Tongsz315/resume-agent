import React, { useState, useEffect } from 'react';
import { useTheme, useLocale } from '../contexts';

interface ModelStatusResponse {
  success: boolean;
  model: string;
  hasApiKey: boolean;
  status: string;
}

const ModelStatus: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLocale();
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [modelName, setModelName] = useState<string>('Unknown');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    // 检查模型连接状态
    const checkModelStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          const data: ModelStatusResponse = await response.json();
          if (data.success) {
            setStatus('connected');
            setModelName(data.model);
            setHasApiKey(data.hasApiKey);
          } else {
            setStatus('error');
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    checkModelStatus();
    // 每30秒检查一次状态
    const interval = setInterval(checkModelStatus, 30000);
    return () => clearInterval(interval);
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
    <div className={`fixed bottom-4 right-4 p-3 rounded-xl shadow-lg z-40 transition-all ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${status === 'connected' && hasApiKey ? 'bg-green-500' : status === 'loading' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {getStatusText()}
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
