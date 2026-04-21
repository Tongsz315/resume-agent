import React, { useState } from 'react';
import { useTheme, useLocale, ThemeType } from '../contexts';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const themes: { type: ThemeType; name: string; icon: string; color: string; desc: string }[] = [
    {
      type: 'modern',
      name: '现代科技',
      icon: '🚀',
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      desc: '明亮清新，科技感强'
    },
    {
      type: 'dark-tech',
      name: '暗黑科技',
      icon: '🌙',
      color: 'bg-gradient-to-r from-purple-600 to-blue-700',
      desc: '神秘酷炫，护眼舒适'
    }
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-xl transition-all shadow-lg ${
          theme === 'modern'
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
            : 'bg-gradient-to-r from-purple-600 to-blue-700 text-white hover:from-purple-700 hover:to-blue-800'
        }`}
        aria-label="切换主题"
      >
        <span className="text-xl">
          {theme === 'modern' ? '🚀' : '🌙'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-16 right-0 w-64 rounded-2xl shadow-2xl overflow-hidden ${
            theme === 'modern'
              ? 'bg-white border border-gray-200'
              : 'bg-slate-900 border border-slate-700'
          }`}>
            <div className={`p-4 border-b ${
              theme === 'modern' ? 'border-gray-100' : 'border-slate-800'
            }`}>
              <h3 className={`font-semibold ${
                theme === 'modern' ? 'text-gray-800' : 'text-white'
              }`}>🎨 选择主题</h3>
            </div>
            <div className="p-3">
              {themes.map((t) => (
                <button
                  key={t.type}
                  onClick={() => {
                    setTheme(t.type);
                    setIsOpen(false);
                  }}
                  className={`w-full p-4 rounded-xl mb-2 text-left transition-all ${
                    theme === t.type
                      ? `${t.color} text-white shadow-lg`
                      : theme === 'modern'
                        ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm opacity-80">{t.desc}</div>
                    </div>
                    {theme === t.type && (
                      <span className="ml-auto text-lg">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
