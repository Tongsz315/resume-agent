import React from 'react';
import { useTheme } from '../contexts';

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  height?: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  height = 'h-48',
}) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';

  return (
    <div className="mb-6">
      <label className={`block text-lg font-semibold mb-3 ${
        isModern ? 'text-slate-800' : 'text-slate-200'
      }`}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${height} p-5 rounded-2xl transition-all resize-none ${
          isModern
            ? 'bg-white text-slate-800 border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400'
            : 'bg-slate-950 text-slate-200 border-2 border-slate-700 focus:border-purple-400 focus:ring-4 focus:ring-purple-900/30 placeholder:text-slate-500'
        }`}
      />
    </div>
  );
};

export default TextAreaInput;