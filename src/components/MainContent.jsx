"use client"

import { useState } from "react"
import { useResearch } from "../context/ResearchContext"
import ResearchCard from "./ResearchCard"
import { FileText, Video, Film, ImageIcon, AlertCircle } from "lucide-react"

const MainContent = () => {
  const { items, selectedCategory, selectedType } = useResearch()
  const [sortBy, setSortBy] = useState("newest")

  // Sort items based on selected sort option
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt)
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

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
    if (selectedCategory && selectedType) {
      return `${selectedCategory} / ${selectedType}s`
    } else if (selectedCategory) {
      return selectedCategory
    } else if (selectedType) {
      return `${selectedType}s`
    }
    return "All Items"
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gold mb-1">{getFilterText()}</h2>
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

          <div className="mt-4 sm:mt-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sortedItems.map((item, index) => (
              <ResearchCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-12 w-12 text-gold/50 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
            <p className="text-gray-400 max-w-md">
              {items.length === 0
                ? "Your research archive is empty. Add your first item by clicking the 'Add Item' button."
                : "No items match your current search or filters. Try adjusting your search terms or clearing filters."}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default MainContent
