import { useEffect, useMemo, useState } from "react";
import ThemeContext from "./themeStore";

const THEME_STORAGE_KEY = "clinicconnect-theme";
const getStoredTheme = () => window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === "dark" ? "light" : "dark"),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
