import React from 'react';
import { useTheme } from '../contexts';

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  height?: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, value, onChange, placeholder, height = 'h-32' }) => {
  const { isDark } = useTheme();

  return (
    <div className="mb-6">
      <label className={`block mb-2 text-sm font-semibold tracking-wide ${
        isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'
      }`}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 rounded-xl border resize-none ${height} text-base leading-relaxed transition-all duration-200 focus:outline-none focus:ring-2 ${
          isDark
            ? 'bg-[#2d2d2f] border-[rgba(255,255,255,0.06)] text-white placeholder-[#6e6e73] focus:border-[#2997ff] focus:ring-[#2997ff]/20'
            : 'bg-white border-[rgba(0,0,0,0.08)] text-[#1d1d1f] placeholder-[#86868b] focus:border-[#0071e3] focus:ring-[#0071e3]/20'
        }`}
      />
    </div>
  );
};

export default TextAreaInput;
