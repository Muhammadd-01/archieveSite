"use client"

import { Clock, Tag, Trash2 } from "lucide-react"

const SearchSuggestions = ({ searchHistory, clearHistory, tags, onSelectSuggestion }) => {
  // Get top 5 tags
  const topTags = tags.slice(0, 5)

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
      {searchHistory.length > 0 && (
        <div className="p-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold text-gray-400">Recent Searches</h3>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                clearHistory()
              }}
              className="text-xs text-gray-500 hover:text-white flex items-center"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Clear
            </button>
          </div>
          <div className="space-y-1">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                onClick={() => onSelectSuggestion(term)}
                className="flex items-center w-full text-left px-2 py-1 text-sm hover:bg-gray-700 rounded"
              >
                <Clock className="h-3 w-3 mr-2 text-gray-400" />
                <span>{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {topTags.length > 0 && (
        <div className="p-2 border-t border-gray-700">
          <h3 className="text-xs font-semibold text-gray-400 mb-1">Popular Tags</h3>
          <div className="flex flex-wrap gap-1">
            {topTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => onSelectSuggestion(tag)}
                className="flex items-center bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-full text-xs"
              >
                <Tag className="h-3 w-3 mr-1 text-gold" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchSuggestions
