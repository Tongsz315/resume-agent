import React from 'react';
import { useLocale, useTheme } from '../contexts';

const LanguageSwitch: React.FC = () => {
  const { locale, setLocale } = useLocale();
  const { isModern } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'zh-CN' || value === 'zh') {
      setLocale('zh');
    } else {
      setLocale('en');
    }
  };

  const selectValue = locale === 'zh' ? 'zh-CN' : 'en-US';

  return (
    <select
      value={selectValue}
      onChange={handleChange}
      className={`fixed top-4 left-4 z-50 px-4 py-2.5 rounded-xl shadow-xl font-semibold text-sm cursor-pointer transition-all ${
        isModern
          ? 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-400'
          : 'bg-slate-900 text-slate-200 border-2 border-slate-700 hover:border-purple-400'
      }`}
    >
      <option value="zh-CN">🇨🇳 中文</option>
      <option value="en-US">🇺🇸 English</option>
    </select>
  );
};

export default LanguageSwitch;
