import { useDarkMode } from '../hooks/useDarkMode';
import { ThemeContext } from './ThemeContextDef';

export function ThemeProvider({ children }) {
  const theme = useDarkMode();
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
