"use client"

import { useState } from "react"
import { useResearch } from "../context/ResearchContext"
import { Sun, Moon, Menu, Search, Plus } from "lucide-react"

const Navbar = ({ toggleSidebar, toggleModal, isDarkMode, toggleDarkMode }) => {
  const { searchTerm, setSearchTerm } = useResearch()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <nav className="sticky top-0 z-10 bg-gradient-to-r from-black via-gray-900 to-black border-b border-gold/30 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gold" />
        </button>

        <h1 className="text-xl font-bold text-gold hidden md:block">Research Archive</h1>
      </div>

      <div
        className={`relative mx-4 flex-1 max-w-xl transition-all duration-300 ${isSearchFocused ? "scale-105" : ""}`}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-800 border border-gray-700 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors mr-2"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5 text-gold" />}
        </button>

        <button
          onClick={toggleModal}
          className="flex items-center gap-1 bg-gradient-to-r from-gold-dark to-gold text-black px-3 py-1.5 rounded-full font-medium hover:shadow-lg hover:shadow-gold/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Item</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar

