import React, { useState } from 'react';
import { useTheme, ThemeType } from '../contexts';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === 'dark-tech';

  const themes: { type: ThemeType; name: string; desc: string }[] = [
    { type: 'modern', name: '浅色', desc: '明亮简洁' },
    { type: 'dark-tech', name: '深色', desc: '暗黑护眼' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          isDark ? 'hover:bg-[rgba(255,255,255,0.08)]' : 'hover:bg-[#f5f5f7]'
        }`}
        style={{ color: isDark ? '#f5f5f7' : '#1d1d1f' }}
        aria-label="切换主题"
      >
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
          <div className={`absolute top-10 right-0 w-48 rounded-2xl overflow-hidden scale-in z-50 ${
            isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)]' : 'bg-white border border-[rgba(0,0,0,0.06)]'
          }`}>
            <div className={`p-3 border-b ${isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-[rgba(0,0,0,0.04)]'}`}>
              <p className={`text-xs font-semibold ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>外观</p>
            </div>
            <div className="p-2">
              {themes.map(t => (
                <button
                  key={t.type}
                  onClick={() => { setTheme(t.type); setIsOpen(false); }}
                  className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-all ${
                    theme === t.type
                      ? isDark ? 'bg-[rgba(41,151,255,0.15)]' : 'bg-[rgba(0,113,227,0.08)]'
                      : isDark ? 'hover:bg-[rgba(255,255,255,0.04)]' : 'hover:bg-[#f5f5f7]'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>{t.name}</p>
                    <p className={`text-xs ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>{t.desc}</p>
                  </div>
                  {theme === t.type && (
                    <span style={{ color: isDark ? '#2997ff' : '#0071e3' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
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
