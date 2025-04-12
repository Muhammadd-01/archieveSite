"use client"

import { useState } from "react"
import { useResearch } from "../context/ResearchContext"
import {
  FileText,
  Video,
  Film,
  ImageIcon,
  ExternalLink,
  Trash2,
  Edit,
  MoreVertical,
  Eye,
  BookmarkIcon,
  Star,
  Calendar,
} from "lucide-react"
import EditModal from "./EditModal"

const ResearchListItem = ({ item, index, isSelecting, isSelected, onSelect }) => {
  const { deleteItem, toggleFavorite, toggleFeatured, incrementViewCount } = useResearch()
  const [showOptions, setShowOptions] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Determine icon based on content type
  const getIcon = () => {
    switch (item.type) {
      case "paper":
        return <FileText className="h-5 w-5 text-blue-400" />
      case "video":
        return <Video className="h-5 w-5 text-red-400" />
      case "documentary":
        return <Film className="h-5 w-5 text-purple-400" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-green-400" />
      default:
        return <FileText className="h-5 w-5 text-blue-400" />
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

  // Handle view click
  const handleViewClick = () => {
    incrementViewCount(item.id)
  }

  return (
    <>
      <div
        className={`bg-gray-900 border ${
          isSelected ? "border-gold" : "border-gray-800"
        } rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex items-center p-3">
          {/* Selection checkbox */}
          {isSelecting && (
            <div className="mr-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(item.id)}
                className="h-5 w-5 accent-gold"
              />
            </div>
          )}

          {/* Type icon */}
          <div className="mr-4 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">{getIcon()}</div>
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center">
              <h3 className="font-bold text-white truncate mr-2">{item.title}</h3>
              {item.favorite && <BookmarkIcon className="h-4 w-4 text-gold mr-1" />}
              {item.featured && <Star className="h-4 w-4 text-gold" />}
            </div>

            <p className="text-gray-400 text-sm truncate">{item.description}</p>

            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span className="flex items-center mr-3">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(item.createdAt)}
              </span>
              <span className="flex items-center mr-3">
                <Eye className="h-3 w-3 mr-1" />
                {item.viewCount || 0}
              </span>
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="bg-gray-800 text-gold px-1.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && <span className="text-gray-500">+{item.tags.length - 3}</span>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center ml-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs font-medium text-gold hover:bg-gold/10 p-2 rounded-full"
              onClick={handleViewClick}
              title="View"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`p-2 rounded-full ${item.favorite ? "text-gold" : "text-gray-400 hover:text-gold"}`}
              title={item.favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <BookmarkIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-full text-gray-400 hover:text-white"
              title="Edit item"
            >
              <Edit className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-full text-gray-400 hover:text-white"
                title="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-1 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => toggleFeatured(item.id)}
                    className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-700"
                  >
                    <Star className={`h-4 w-4 mr-2 ${item.featured ? "text-gold" : ""}`} />
                    {item.featured ? "Remove Featured" : "Add Featured"}
                  </button>
                  <button
                    onClick={() => {
                      deleteItem(item.id)
                      setShowOptions(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-left text-red-400 hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && <EditModal item={item} closeModal={() => setShowEditModal(false)} />}
    </>
  )
}

export default ResearchListItem
