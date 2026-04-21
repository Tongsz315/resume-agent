import React from 'react';
import { useTheme } from '../contexts';

interface InputModeToggleProps {
  mode: 'text' | 'file';
  onModeChange: (mode: 'text' | 'file') => void;
}

const InputModeToggle: React.FC<InputModeToggleProps> = ({ mode, onModeChange }) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';

  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={() => onModeChange('text')}
        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
          mode === 'text'
            ? isModern
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
            : isModern
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
        }`}
      >
        📝 粘贴文本
      </button>
      <button
        onClick={() => onModeChange('file')}
        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
          mode === 'file'
            ? isModern
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
            : isModern
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
        }`}
      >
        📎 上传文件
      </button>
    </div>
  );
};

export default InputModeToggle;