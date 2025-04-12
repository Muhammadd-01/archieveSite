"use client"

import { createContext, useState, useEffect, useContext } from "react"

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
  },
]

export const ResearchProvider = ({ children }) => {
  // State for research items
  const [items, setItems] = useState([])

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedType, setSelectedType] = useState("")

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
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("researchItems", JSON.stringify(items))
  }, [items])

  // Get all unique categories
  const categories = [...new Set(items.map((item) => item.category))]

  // Add new item
  const addItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setItems([...items, itemWithId])
  }

  // Delete item
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  // Update item
  const updateItem = (updatedItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  // Filter items based on search term and filters
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "" || item.category === selectedCategory
    const matchesType = selectedType === "" || item.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <ResearchContext.Provider
      value={{
        items: filteredItems,
        categories,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedType,
        setSelectedType,
        addItem,
        deleteItem,
        updateItem,
      }}
    >
      {children}
    </ResearchContext.Provider>
  )
}

// Custom hook to use the research context
export const useResearch = () => useContext(ResearchContext)
