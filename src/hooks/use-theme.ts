import { useEffect, useState } from "react";

const KEY = "theme";

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(KEY)) as
      | "light"
      | "dark"
      | null;
    const initial =
      stored ??
      (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setThemeState(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const setTheme = (t: "light" | "dark") => {
    setThemeState(t);
    localStorage.setItem(KEY, t);
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
