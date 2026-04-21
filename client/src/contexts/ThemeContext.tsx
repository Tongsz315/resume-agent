import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'modern' | 'dark-tech';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
  isModern: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    return savedTheme === 'modern' || savedTheme === 'dark-tech' ? savedTheme : 'modern';
  });

  const isDark = theme === 'dark-tech';
  const isModern = theme === 'modern';

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('modern', 'dark-tech');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, isModern }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
