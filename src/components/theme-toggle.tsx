import React, { useEffect, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface ThemeToggleProps {}

export function ThemeToggle({}: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center px-2 py-2 rounded-full 
      dark:border-gray-600 
       dark:bg-gray-800 
      hover:bg-gray-50 dark:hover:bg-gray-700 bg-gray-100/40 backdrop-blur-xs
      transition-all duration-200 border border-gray-200 "
    >
      {isDark ? (
        <DarkModeIcon fontSize="small" className="text-yellow-400" />
      ) : (
        <LightModeIcon fontSize="small" className="text-yellow-400" />
      )}
    </button>
  );
}
