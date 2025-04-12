"use client"
import { useResearch } from "../context/ResearchContext"
import { Menu, Plus, BookmarkIcon, LayoutGrid } from "lucide-react"
import EnhancedSearch from "./EnhancedSearch"
import ThemeToggle from "./ThemeToggle"
import ImportExport from "./ImportExport"

const Navbar = ({
  toggleSidebar,
  toggleModal,
  toggleImportExport,
  isDarkMode,
  toggleDarkMode,
  toggleFeatured,
  showFeatured,
}) => {
  const { showFavoritesOnly, setShowFavoritesOnly } = useResearch()

  return (
    <nav className="sticky top-0 z-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-gold/30 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gold" />
        </button>

        <h1 className="text-xl font-bold text-gold hidden md:block font-display">Research Archive</h1>
      </div>

      <EnhancedSearch />

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`p-2 rounded-full transition-colors ${
            showFavoritesOnly ? "bg-gold/20 text-gold" : "hover:bg-gray-800 text-gray-400"
          }`}
          aria-label={showFavoritesOnly ? "Show all items" : "Show favorites only"}
          title={showFavoritesOnly ? "Show all items" : "Show favorites only"}
        >
          <BookmarkIcon className="h-5 w-5" />
        </button>

        <button
          onClick={toggleFeatured}
          className={`p-2 rounded-full transition-colors ${
            showFeatured ? "bg-gold/20 text-gold" : "hover:bg-gray-800 text-gray-400"
          }`}
          aria-label={showFeatured ? "Hide featured carousel" : "Show featured carousel"}
          title={showFeatured ? "Hide featured carousel" : "Show featured carousel"}
        >
          <LayoutGrid className="h-5 w-5" />
        </button>

        <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

        <div className="hidden md:block">
          <ImportExport toggleImportExport={toggleImportExport} />
        </div>

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
