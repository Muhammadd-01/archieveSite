"use client"

import { useState, useEffect, useRef } from "react"
import { useResearch } from "../context/ResearchContext"
import { Search, X, Clock, History } from "lucide-react"

const EnhancedSearch = () => {
  const { searchTerm, setSearchTerm, searchResults } = useResearch()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef(null)

  // Load search history from localStorage on component mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || []
    setSearchHistory(history)
  }, [])

  // Save search history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.trim()) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Add to search history if not already present
      if (!searchHistory.includes(searchTerm.trim())) {
        setSearchHistory((prev) => [searchTerm.trim(), ...prev.slice(0, 9)])
      }
      setShowSuggestions(false)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setShowSuggestions(false)
  }

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)

    // Add to search history if not already present
    if (!searchHistory.includes(suggestion)) {
      setSearchHistory((prev) => [suggestion, ...prev.slice(0, 9)])
    }
  }

  const removeFromHistory = (e, term) => {
    e.stopPropagation()
    setSearchHistory((prev) => prev.filter((item) => item !== term))
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => {
              setIsFocused(true)
              if (searchTerm.trim() || searchHistory.length > 0) {
                setShowSuggestions(true)
              }
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Search research items..."
            className="w-full px-4 py-2 pl-10 pr-10 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
            aria-label="Search"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search suggestions and history */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {/* Search results */}
          {searchTerm.trim() && searchResults.length > 0 && (
            <div className="p-2">
              <div className="flex justify-between items-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                <span>Search Results</span>
                <span>{searchResults.length} items</span>
              </div>
              <ul>
                {searchResults.slice(0, 5).map((result, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md transition-colors duration-150"
                    onClick={() => selectSuggestion(result.title)}
                  >
                    <div className="font-medium">{result.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search history */}
          {searchHistory.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400"
                >
                  Clear All
                </button>
              </div>
              <ul>
                {searchHistory.map((term, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md transition-colors duration-150"
                    onClick={() => selectSuggestion(term)}
                  >
                    <div className="flex items-center">
                      <History className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span>{term}</span>
                    </div>
                    <button
                      onClick={(e) => removeFromHistory(e, term)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No results */}
          {searchTerm.trim() && searchResults.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">No results found for "{searchTerm}"</div>
          )}
        </div>
      )}
    </div>
  )
}

export default EnhancedSearch
