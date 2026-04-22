import React from 'react';
import { useTheme } from '../contexts';

interface PageNavProps {
  sections: { id: string; label: string }[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

const PageNav: React.FC<PageNavProps> = ({ sections, activeIndex, onNavigate }) => {
  const { isDark } = useTheme();

  return (
    <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-2">
      {sections.map((section, i) => (
        <button
          key={section.id}
          onClick={() => onNavigate(i)}
          className="group flex items-center gap-3 py-1"
          aria-label={`Navigate to ${section.label}`}
        >
          <span className={`text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap ${
            activeIndex === i
              ? isDark ? 'text-[#2997ff]' : 'text-[#0071e3]'
              : isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'
          }`}>
            {section.label}
          </span>
          <span className="relative flex items-center justify-center" style={{ width: '12px', height: '12px' }}>
            {activeIndex === i && (
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ background: isDark ? '#2997ff' : '#0071e3' }}
              />
            )}
            <span className={`block rounded-full transition-all duration-500 ${
              activeIndex === i
                ? isDark
                  ? 'w-2.5 h-2.5 bg-[#2997ff]'
                  : 'w-2.5 h-2.5 bg-[#0071e3]'
                : isDark
                  ? 'w-1.5 h-1.5 bg-[#4e4e53] group-hover:bg-[#86868b] group-hover:w-2 group-hover:h-2'
                  : 'w-1.5 h-1.5 bg-[#d2d2d7] group-hover:bg-[#86868b] group-hover:w-2 group-hover:h-2'
            }`} />
          </span>
        </button>
      ))}
    </nav>
  );
};

export default PageNav;
