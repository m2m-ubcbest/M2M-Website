import React, { useEffect, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface ThemeToggleProps {}

export function ThemeToggle({}: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // initialize based on existing class
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center px-2 py-2 rounded-full 
      dark:border-gray-600 
       dark:bg-gray-800 
      hover:bg-gray-100 dark:hover:bg-gray-700 
      transition-all duration-200 border border-gray-200"
    >
      {isDark ? (
        <DarkModeIcon fontSize="small" className="text-yellow-400" />
      ) : (
        <LightModeIcon fontSize="small" className="text-yellow-400" />
      )}
    </button>
  );
}
