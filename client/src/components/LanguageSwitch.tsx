import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

const LanguageSwitch: React.FC = () => {
  const { locale, setLocale } = useLocale();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as 'zh-CN' | 'en-US')}
      className="fixed top-4 left-4 z-50 px-3 py-2 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm cursor-pointer"
    >
      <option value="zh-CN">🇨🇳 中文</option>
      <option value="en-US">🇺🇸 English</option>
    </select>
  );
};

export default LanguageSwitch;