"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { showToast } from "../components/Toast"

// Create context
const ResearchContext = createContext()

// Sample initial data
const sampleData = [
  {
    id: "1",
    type: "paper",
    title: "The Impact of AI on Modern Research",
    tags: ["AI", "Technology", "Research"],
    category: "Technology",
    description: "A comprehensive study on how AI is transforming research methodologies.",
    url: "https://example.com/ai-research.pdf",
    createdAt: new Date().toISOString(),
    viewCount: 12,
    favorite: true,
    featured: true,
  },
  {
    id: "2",
    type: "video",
    title: "Understanding Quantum Computing",
    tags: ["Quantum", "Computing", "Physics"],
    category: "Science",
    description: "An in-depth explanation of quantum computing principles.",
    url: "https://www.youtube.com/embed/JhHMJCUmq28",
    thumbnail: "https://i.ytimg.com/vi/JhHMJCUmq28/hqdefault.jpg",
    createdAt: new Date().toISOString(),
    viewCount: 8,
    favorite: false,
    featured: true,
  },
  {
    id: "3",
    type: "documentary",
    title: "The Hidden Life of Trees",
    tags: ["Nature", "Biology", "Environment"],
    category: "Nature",
    description: "Exploring the complex communication systems between trees.",
    url: "https://example.com/trees-documentary",
    thumbnail: "/placeholder.svg?height=200&width=300",
    createdAt: new Date().toISOString(),
    viewCount: 5,
    favorite: false,
    featured: false,
  },
  {
    id: "4",
    type: "image",
    title: "Neural Network Visualization",
    tags: ["AI", "Visualization", "Neural Networks"],
    category: "Technology",
    description: "Visual representation of a neural network architecture.",
    url: "/placeholder.svg?height=400&width=600",
    createdAt: new Date().toISOString(),
    viewCount: 3,
    favorite: false,
    featured: false,
  },
]

export const ResearchProvider = ({ children }) => {
  // State for research items
  const [items, setItems] = useState([])

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [searchHistory, setSearchHistory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [recentlyAdded, setRecentlyAdded] = useState([])

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem("researchItems")
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    } else {
      // Use sample data if no stored items
      setItems(sampleData)
      localStorage.setItem("researchItems", JSON.stringify(sampleData))
    }

    // Load search history
    const storedHistory = localStorage.getItem("searchHistory")
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory))
    }

    // Load view mode preference
    const storedViewMode = localStorage.getItem("viewMode")
    if (storedViewMode) {
      setViewMode(storedViewMode)
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("researchItems", JSON.stringify(items))

    // Update recently added items
    const sortedByDate = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setRecentlyAdded(sortedByDate.slice(0, 5))
  }, [items])

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode)
  }, [viewMode])

  // Get all unique categories
  const categories = [...new Set(items.map((item) => item.category))]

  // Add search term to history
  const addToSearchHistory = (term) => {
    if (!term || term.trim() === "") return

    // Remove the term if it already exists (to avoid duplicates)
    const filteredHistory = searchHistory.filter((item) => item.toLowerCase() !== term.toLowerCase())

    // Add the new term at the beginning and limit to 10 items
    const newHistory = [term, ...filteredHistory].slice(0, 10)
    setSearchHistory(newHistory)
  }

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
    showToast("Search history cleared", "success")
  }

  // Add new item
  const addItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      viewCount: 0,
      favorite: false,
      featured: false,
    }
    setItems([itemWithId, ...items])
    showToast(`${newItem.title} added successfully`, "success")
  }

  // Delete item
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id))
    showToast("Item deleted", "success")
  }

  // Update item
  const updateItem = (updatedItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    showToast(`${updatedItem.title} updated`, "success")
  }

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, favorite: !item.favorite }
        }
        return item
      }),
    )
  }

  // Toggle featured status
  const toggleFeatured = (id) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, featured: !item.featured }
        }
        return item
      }),
    )
  }

  // Increment view count
  const incrementViewCount = (id) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, viewCount: (item.viewCount || 0) + 1, lastViewed: new Date().toISOString() }
        }
        return item
      }),
    )
  }

  // Import items
  const importItems = (newItems) => {
    try {
      // Validate items
      if (!Array.isArray(newItems)) {
        throw new Error("Invalid import format")
      }

      // Add IDs and timestamps if missing
      const processedItems = newItems.map((item) => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: item.createdAt || new Date().toISOString(),
        viewCount: item.viewCount || 0,
        favorite: item.favorite || false,
        featured: item.featured || false,
      }))

      // Merge with existing items, avoiding duplicates by ID
      const existingIds = new Set(items.map((item) => item.id))
      const uniqueNewItems = processedItems.filter((item) => !existingIds.has(item.id))

      setItems([...uniqueNewItems, ...items])
      showToast(`${uniqueNewItems.length} items imported successfully`, "success")
      return true
    } catch (error) {
      showToast(`Import failed: ${error.message}`, "error")
      return false
    }
  }

  // Export items
  const exportItems = (selectedIds = null) => {
    try {
      const dataToExport = selectedIds ? items.filter((item) => selectedIds.includes(item.id)) : items

      return {
        data: dataToExport,
        count: dataToExport.length,
      }
    } catch (error) {
      showToast(`Export failed: ${error.message}`, "error")
      return { data: [], count: 0 }
    }
  }

  // Filter items based on search term and filters
  const filteredItems = items.filter((item) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))

    // Category filter
    const matchesCategory = selectedCategory === "" || item.category === selectedCategory

    // Type filter
    const matchesType = selectedType === "" || item.type === selectedType

    // Favorites filter
    const matchesFavorites = !showFavoritesOnly || item.favorite

    // Date range filter
    let matchesDateRange = true
    if (dateRange.start || dateRange.end) {
      const itemDate = new Date(item.createdAt)
      if (dateRange.start && dateRange.end) {
        matchesDateRange = itemDate >= dateRange.start && itemDate <= dateRange.end
      } else if (dateRange.start) {
        matchesDateRange = itemDate >= dateRange.start
      } else if (dateRange.end) {
        matchesDateRange = itemDate <= dateRange.end
      }
    }

    return matchesSearch && matchesCategory && matchesType && matchesFavorites && matchesDateRange
  })

  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt)
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "mostViewed") {
      return (b.viewCount || 0) - (a.viewCount || 0)
    } else if (sortBy === "lastViewed") {
      if (!a.lastViewed && !b.lastViewed) return 0
      if (!a.lastViewed) return 1
      if (!b.lastViewed) return -1
      return new Date(b.lastViewed) - new Date(a.lastViewed)
    }
    return 0
  })

  // Get featured items
  const featuredItems = items.filter((item) => item.featured)

  // Get search results for suggestions
  const searchResults = searchTerm
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : []

  return (
    <ResearchContext.Provider
      value={{
        items: sortedItems,
        allItems: items,
        featuredItems,
        recentlyAdded,
        categories,
        searchTerm,
        setSearchTerm,
        searchHistory,
        addToSearchHistory,
        clearSearchHistory,
        selectedCategory,
        setSelectedCategory,
        selectedType,
        setSelectedType,
        showFavoritesOnly,
        setShowFavoritesOnly,
        dateRange,
        setDateRange,
        viewMode,
        setViewMode,
        sortBy,
        setSortBy,
        addItem,
        deleteItem,
        updateItem,
        toggleFavorite,
        toggleFeatured,
        incrementViewCount,
        importItems,
        exportItems,
        searchResults,
      }}
    >
      {children}
    </ResearchContext.Provider>
  )
}

// Custom hook to use the research context
export const useResearch = () => useContext(ResearchContext)
