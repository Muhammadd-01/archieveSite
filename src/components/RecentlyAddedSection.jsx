"use client"

import { useState } from "react"
import { useResearch } from "../context/ResearchContext"
import { Clock, ChevronDown, ChevronUp, ExternalLink, Eye } from "lucide-react"

const RecentlyAddedSection = ({ onToggle }) => {
  const { recentlyAdded, incrementViewCount } = useResearch()
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (onToggle) {
      onToggle()
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get icon based on content type
  const getTypeIcon = (type) => {
    switch (type) {
      case "paper":
        return "📄"
      case "video":
        return "🎬"
      case "documentary":
        return "📺"
      case "image":
        return "🖼️"
      default:
        return "📄"
    }
  }

  // Handle view click
  const handleViewClick = (id) => {
    incrementViewCount(id)
  }

  if (recentlyAdded.length === 0) {
    return null
  }

  return (
    <div className="mb-8 bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gold mr-2" />
          <h2 className="text-lg font-semibold text-white">Recently Added</h2>
          <span className="ml-2 text-sm text-gray-400">({recentlyAdded.length})</span>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-800">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyAdded.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start">
                  <div className="text-2xl mr-3">{getTypeIcon(item.type)}</div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-white truncate">{item.title}</h3>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span className="mr-2">{formatDate(item.createdAt)}</span>
                      {typeof item.viewCount === "number" && (
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {item.viewCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs bg-gray-700 text-gold px-1.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>}
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs font-medium text-gold hover:underline"
                        onClick={() => handleViewClick(item.id)}
                      >
                        View <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentlyAddedSection
