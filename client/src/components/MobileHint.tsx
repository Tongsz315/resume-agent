import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface MobileHintProps {
  children?: React.ReactNode;
}

const MobileHint: React.FC<MobileHintProps> = ({ children }) => {
  const { isDark } = useTheme();
  return (
    <div className={`mt-8 p-4 rounded-xl text-center text-sm ${
      isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-white/50 text-gray-600'
    }`}>
      {children || '💡 提示：分析结果仅供参考，建议结合实际情况进行调整'}
    </div>
  );
};

export default MobileHint;