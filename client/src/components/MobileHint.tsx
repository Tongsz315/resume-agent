import React from 'react';
import { useTheme } from '../contexts';

interface MobileHintProps {
  children?: React.ReactNode;
}

const MobileHint: React.FC<MobileHintProps> = ({ children }) => {
  const { isModern } = useTheme();
  return (
    <div className={`mt-8 p-5 rounded-2xl text-center text-sm ${
      isModern
        ? 'bg-white/50 backdrop-blur text-slate-600 border border-slate-200/50'
        : 'bg-slate-900/50 backdrop-blur text-slate-400 border border-slate-700/50'
    }`}>
      {children || '💡 提示：分析结果仅供参考，建议结合实际情况进行调整'}
    </div>
  );
};

export default MobileHint;
