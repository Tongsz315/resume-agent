import React from 'react';

interface InputModeToggleProps {
  mode: 'text' | 'file';
  onModeChange: (mode: 'text' | 'file') => void;
}

const InputModeToggle: React.FC<InputModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onModeChange('text')}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          mode === 'text'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        📝 粘贴文本
      </button>
      <button
        onClick={() => onModeChange('file')}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          mode === 'file'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        📎 上传文件
      </button>
    </div>
  );
};

export default InputModeToggle;