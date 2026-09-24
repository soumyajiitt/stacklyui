"use client";

import * as React from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** localStorage key used to persist the choice. Default: "stackly-theme". */
  storageKey?: string;
  /** Theme used before a stored/system value resolves. Default: "dark". */
  defaultTheme?: Theme;
}

/**
 * A tiny, dependency-free theme provider.
 *
 * It toggles the `dark` class (and `color-scheme`) on `<html>` and persists the
 * choice to localStorage. Pair it with {@link ThemeScript} in your document
 * `<head>` to set the class before first paint and avoid a flash.
 */
export function ThemeProvider({
  children,
  storageKey = "stackly-theme",
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setThemeState(prefersDark ? "dark" : "light");
    }
  }, [storageKey]);

  const apply = React.useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
  }, []);

  React.useEffect(() => {
    apply(theme);
  }, [theme, apply]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next);
      window.localStorage.setItem(storageKey, next);
    },
    [storageKey],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>.");
  return ctx;
}

/**
 * Inline script that sets the theme class before hydration to prevent a
 * flash of the wrong theme. Render it in `<head>`:
 *
 * @example
 * <head><ThemeScript /></head>
 */
export function ThemeScript({
  storageKey = "stackly-theme",
  defaultTheme = "dark",
}: {
  storageKey?: string;
  defaultTheme?: Theme;
}) {
  const code = `(function(){try{var k=${JSON.stringify(
    storageKey,
  )};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var d=t==="dark"||(t==null&&${JSON.stringify(
    defaultTheme,
  )}==="dark");document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
