"use client"

import { useState, useEffect } from "react"
import { useResearch } from "../context/ResearchContext"
import ResearchCard from "./ResearchCard"
import ResearchListItem from "./ResearchListItem"
import { FileText, Video, Film, ImageIcon, AlertCircle, Grid, List, Filter, Search } from "lucide-react"
import { showToast } from "./Toast"
import RecentlyAddedSection from "./RecentlyAddedSection"

const MainContent = () => {
  const {
    items,
    selectedCategory,
    selectedType,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    showFavoritesOnly,
    searchTerm,
  } = useResearch()

  const [selectedItems, setSelectedItems] = useState([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [showRecentlyAdded, setShowRecentlyAdded] = useState(true)

  // Effect to check if we should show recently added section
  useEffect(() => {
    const savedPref = localStorage.getItem("showRecentlyAdded")
    if (savedPref !== null) {
      setShowRecentlyAdded(savedPref === "true")
    }
  }, [])

  // Toggle recently added section
  const toggleRecentlyAdded = () => {
    const newValue = !showRecentlyAdded
    setShowRecentlyAdded(newValue)
    localStorage.setItem("showRecentlyAdded", newValue.toString())
  }

  // Get counts for each content type
  const counts = {
    total: items.length,
    paper: items.filter((item) => item.type === "paper").length,
    video: items.filter((item) => item.type === "video").length,
    documentary: items.filter((item) => item.type === "documentary").length,
    image: items.filter((item) => item.type === "image").length,
  }

  // Get active filters text
  const getFilterText = () => {
    const filters = []

    if (selectedCategory) filters.push(selectedCategory)
    if (selectedType) filters.push(`${selectedType}s`)
    if (showFavoritesOnly) filters.push("Favorites")
    if (searchTerm) filters.push(`"${searchTerm}"`)

    if (filters.length === 0) return "All Items"
    return filters.join(" / ")
  }

  // Toggle item selection
  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Toggle selection mode
  const toggleSelectionMode = () => {
    if (isSelecting) {
      setSelectedItems([])
    }
    setIsSelecting(!isSelecting)
  }

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) {
      showToast("Please select items first", "error")
      return
    }

    // Implement bulk actions here
    showToast(`${action} ${selectedItems.length} items`, "success")
    setSelectedItems([])
    setIsSelecting(false)
  }

  // Check if search is active
  const isSearchActive = searchTerm && searchTerm.length > 0

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Show recently added section if enabled and not searching/filtering */}
        {showRecentlyAdded && !isSearchActive && !selectedCategory && !selectedType && !showFavoritesOnly && (
          <RecentlyAddedSection onToggle={toggleRecentlyAdded} />
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gold mb-1 font-display">{getFilterText()}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                <span>{counts.paper} Papers</span>
              </div>
              <div className="flex items-center">
                <Video className="h-3 w-3 mr-1" />
                <span>{counts.video} Videos</span>
              </div>
              <div className="flex items-center">
                <Film className="h-3 w-3 mr-1" />
                <span>{counts.documentary} Docs</span>
              </div>
              <div className="flex items-center">
                <ImageIcon className="h-3 w-3 mr-1" />
                <span>{counts.image} Images</span>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            {/* View mode toggle */}
            <div className="flex border border-gray-700 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gold/20 text-gold" : "text-gray-400 hover:bg-gray-800"}`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gold/20 text-gold" : "text-gray-400 hover:bg-gray-800"}`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Selection mode toggle */}
            <button
              onClick={toggleSelectionMode}
              className={`p-2 rounded-md ${isSelecting ? "bg-gold/20 text-gold" : "text-gray-400 hover:bg-gray-800"}`}
              title="Select Items"
            >
              <Filter className="h-4 w-4" />
            </button>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="mostViewed">Most Viewed</option>
              <option value="lastViewed">Recently Viewed</option>
            </select>
          </div>
        </div>

        {/* Selection mode controls */}
        {isSelecting && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-wrap gap-2 items-center animate-fade-in">
            <span className="text-sm text-gray-300">
              {selectedItems.length} of {items.length} selected
            </span>
            <button onClick={selectAllItems} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md">
              {selectedItems.length === items.length ? "Deselect All" : "Select All"}
            </button>
            <div className="flex-grow"></div>
            <button
              onClick={() => handleBulkAction("Delete")}
              className="px-3 py-1 text-sm bg-red-900 hover:bg-red-800 rounded-md"
              disabled={selectedItems.length === 0}
            >
              Delete Selected
            </button>
            <button
              onClick={() => handleBulkAction("Export")}
              className="px-3 py-1 text-sm bg-gold/20 hover:bg-gold/30 text-gold rounded-md"
              disabled={selectedItems.length === 0}
            >
              Export Selected
            </button>
          </div>
        )}

        {/* Search results indicator */}
        {isSearchActive && (
          <div className="mb-4 p-3 bg-gold/10 rounded-lg border border-gold/20 flex items-center animate-fade-in">
            <Search className="h-5 w-5 text-gold mr-2" />
            <span className="text-sm text-gold">
              Found {items.length} results for "{searchTerm}"
            </span>
          </div>
        )}

        {items.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {items.map((item, index) => (
                <ResearchCard
                  key={item.id}
                  item={item}
                  index={index}
                  isSelecting={isSelecting}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={toggleItemSelection}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <ResearchListItem
                  key={item.id}
                  item={item}
                  index={index}
                  isSelecting={isSelecting}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={toggleItemSelection}
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative">
              <AlertCircle className="h-16 w-16 text-gold/30 mb-4" />
              <div className="absolute inset-0 bg-gold/10 rounded-full animate-pulse-gold"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
            <p className="text-gray-400 max-w-md">
              {searchTerm || selectedCategory || selectedType || showFavoritesOnly
                ? "No items match your current search or filters. Try adjusting your search terms or clearing filters."
                : "Your research archive is empty. Add your first item by clicking the 'Add Item' button."}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default MainContent
