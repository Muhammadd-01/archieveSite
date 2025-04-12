"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      return savedTheme === "dark"
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode((prev) => !prev)
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center p-2 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 transform hover:scale-110"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="absolute transition-opacity duration-300" style={{ opacity: darkMode ? 0 : 1 }}>
        <Sun className="h-5 w-5 text-yellow-600" />
      </div>
      <div className="absolute transition-opacity duration-300" style={{ opacity: darkMode ? 1 : 0 }}>
        <Moon className="h-5 w-5 text-yellow-400" />
      </div>
    </button>
  )
}

export default ThemeToggle
