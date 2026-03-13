import { createContext, useContext } from 'react';
import { DEFAULT_THEME } from '../config/defaults';
import { Theme } from '../config/types';

const ThemeContext = createContext<Theme>(DEFAULT_THEME);

export const ThemeProvider = ({ theme, children }: { theme: Theme; children: React.ReactNode }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
