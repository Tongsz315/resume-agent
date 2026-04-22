import React from 'react';
import { useLocale, useTheme } from '../contexts';

const LanguageSwitch: React.FC = () => {
  const { locale, setLocale } = useLocale();
  const { isDark } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value === 'zh-CN' ? 'zh' : 'en');
  };

  return (
    <select
      value={locale === 'zh' ? 'zh-CN' : 'en-US'}
      onChange={handleChange}
      className={`px-2 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 appearance-none text-center ${
        isDark
          ? 'bg-[rgba(255,255,255,0.08)] text-[#f5f5f7] border-0'
          : 'bg-[rgba(0,0,0,0.05)] text-[#1d1d1f] border-0'
      }`}
    >
      <option value="zh-CN">中</option>
      <option value="en-US">EN</option>
    </select>
  );
};

export default LanguageSwitch;
