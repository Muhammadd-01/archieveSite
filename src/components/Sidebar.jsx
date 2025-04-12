"use client"
import { useResearch } from "../context/ResearchContext"
import { FileText, Video, ImageIcon, Film, Tag, X, BookmarkIcon } from "lucide-react"
import DateRangeFilter from "./DateRangeFilter"

const Sidebar = ({ isOpen }) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    showFavoritesOnly,
    setShowFavoritesOnly,
  } = useResearch()

  const contentTypes = [
    { id: "paper", name: "Papers", icon: <FileText className="h-4 w-4" /> },
    { id: "video", name: "Videos", icon: <Video className="h-4 w-4" /> },
    { id: "documentary", name: "Documentaries", icon: <Film className="h-4 w-4" /> },
    { id: "image", name: "Images", icon: <ImageIcon className="h-4 w-4" /> },
  ]

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("")
    } else {
      setSelectedCategory(category)
    }
  }

  const handleTypeClick = (type) => {
    if (selectedType === type) {
      setSelectedType("")
    } else {
      setSelectedType(type)
    }
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedType("")
    setShowFavoritesOnly(false)
  }

  return (
    <aside
      className={`bg-gradient-to-b from-black via-gray-900 to-black border-r border-gold/30 overflow-y-auto transition-all duration-300 ${
        isOpen ? "w-64" : "w-0"
      }`}
    >
      {isOpen && (
        <div className="p-4">
          {/* Categories Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 cursor-pointer">
              <h2 className="text-lg font-semibold text-gold flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Categories
              </h2>
            </div>

            <>
              {(selectedCategory || selectedType || showFavoritesOnly) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-gold flex items-center mb-2 transition-colors"
                >
                  Clear All Filters <X className="h-3 w-3 ml-1" />
                </button>
              )}

              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-all ${
                        selectedCategory === category
                          ? "bg-gold/20 text-gold font-medium"
                          : "hover:bg-gray-800 text-gray-300 hover:translate-x-1"
                      }`}
                    >
                      {category}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic px-3 py-2">No categories yet</p>
                )}
              </div>
            </>
          </div>

          {/* Content Types Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 cursor-pointer">
              <h2 className="text-lg font-semibold text-gold">Content Types</h2>
            </div>

            <div className="space-y-1">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeClick(type.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center ${
                    selectedType === type.id
                      ? "bg-gold/20 text-gold font-medium"
                      : "hover:bg-gray-800 text-gray-300 hover:translate-x-1"
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 cursor-pointer">
              <h2 className="text-lg font-semibold text-gold">Filters</h2>
            </div>

            <div className="space-y-3">
              {/* Favorites Filter */}
              <div className="flex items-center px-3">
                <input
                  type="checkbox"
                  id="favorites-filter"
                  checked={showFavoritesOnly}
                  onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className="mr-2 h-4 w-4 accent-gold"
                />
                <label htmlFor="favorites-filter" className="flex items-center text-gray-300 cursor-pointer">
                  <BookmarkIcon className="h-4 w-4 mr-1 text-gold" />
                  Favorites Only
                </label>
              </div>

              {/* Date Range Filter */}
              <DateRangeFilter />
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
