"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verifica tema salvo ou preferência do sistema
    const storedTheme = localStorage.getItem("calendly_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("calendly_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("calendly_theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      className="p-2 rounded-xl transition-all duration-200 border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm"
    >
      {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-neutral-700" />}
    </button>
  );
}

