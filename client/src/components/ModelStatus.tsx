import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts';

const ModelStatus: React.FC = () => {
  const { isDark } = useTheme();
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          if (mounted) { setStatus(data.success ? 'connected' : 'error'); setHasApiKey(data.hasApiKey); }
        } else if (mounted) setStatus('error');
      } catch { if (mounted) setStatus('error'); }
    };
    check();
    const interval = setInterval(check, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <div className={`fixed right-4 bottom-20 md:bottom-4 px-3 py-2 rounded-full flex items-center gap-2 z-30 text-xs font-medium ${
      isDark ? 'bg-[rgba(255,255,255,0.06)] text-[#6e6e73]' : 'bg-[rgba(0,0,0,0.04)] text-[#86868b]'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        status === 'connected' && hasApiKey ? 'bg-[#34c759]' : status === 'loading' ? 'bg-[#ff9f0a] animate-pulse' : 'bg-[#ff3b30]'
      }`} />
      {status === 'connected' && hasApiKey ? '已连接' : status === 'loading' ? '检测中' : !hasApiKey ? '未配置 Key' : '连接失败'}
    </div>
  );
};

export default ModelStatus;
