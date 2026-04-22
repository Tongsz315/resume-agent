import React from 'react';
import { useTheme } from '../contexts';

interface InputModeToggleProps {
  mode: 'text' | 'file';
  onModeChange: (mode: 'text' | 'file') => void;
}

const InputModeToggle: React.FC<InputModeToggleProps> = ({ mode, onModeChange }) => {
  const { isDark } = useTheme();

  return (
    <div className="flex gap-1 mb-6 p-1 rounded-xl inline-flex" style={{
      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
    }}>
      {(['text', 'file'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onModeChange(m)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === m
              ? isDark
                ? 'bg-[#2997ff] text-white shadow-lg'
                : 'bg-white text-[#1d1d1f] shadow-sm'
              : isDark
                ? 'text-[#a1a1a6] hover:text-white'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          {m === 'text' ? '文本输入' : '文件上传'}
        </button>
      ))}
    </div>
  );
};

export default InputModeToggle;
