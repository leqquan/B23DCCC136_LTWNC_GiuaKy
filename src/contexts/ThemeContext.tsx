import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Đọc theme lưu trữ hoặc mặc định light
    const saved = localStorage.getItem('mini_library_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('mini_library_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Yêu cầu kỹ thuật 4: dùng useMemo cho value của Context
  const value = useMemo<ThemeContextType>(() => ({
    theme,
    toggleTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={`app-root ${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Yêu cầu kỹ thuật 4: custom hook useTheme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
