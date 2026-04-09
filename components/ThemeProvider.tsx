"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.style.setProperty("--background", "#fafafa");
      root.style.setProperty("--foreground", "#171717");
      root.style.setProperty("--card", "#ffffff");
      root.style.setProperty("--card-foreground", "#0a0a0a");
      root.style.setProperty("--primary", "#7c3aed");
      root.style.setProperty("--secondary", "#f4f4f5");
      root.style.setProperty("--muted", "#f5f5f5");
      root.style.setProperty("--muted-foreground", "#71717a");
    } else {
      root.classList.add("dark");
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--foreground", "#ededed");
      root.style.setProperty("--card", "#1a1a1a");
      root.style.setProperty("--card-foreground", "#f0f0f0");
      root.style.setProperty("--primary", "#8b5cf6");
      root.style.setProperty("--secondary", "#27272a");
      root.style.setProperty("--muted", "#262626");
      root.style.setProperty("--muted-foreground", "#a1a1aa");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}