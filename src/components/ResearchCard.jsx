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
} from "lucide-react"
import EditModal from "./EditModal"

const ResearchCard = ({ item, index, isSelecting, isSelected, onSelect }) => {
  const { deleteItem, toggleFavorite, toggleFeatured, incrementViewCount } = useResearch()
  const [showOptions, setShowOptions] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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

  // Handle YouTube URL to get embed URL
  const getEmbedUrl = (url) => {
    if (!url) return ""

    // If it's already an embed URL, return it
    if (url.includes("youtube.com/embed/")) {
      return url
    }

    // Convert YouTube watch URL to embed URL
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(youtubeRegex)

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }

    return url
  }

  // Handle view click
  const handleViewClick = () => {
    incrementViewCount(item.id)
  }

  // Render thumbnail or preview based on content type
  const renderPreview = () => {
    switch (item.type) {
      case "video":
        if (item.url && item.url.includes("youtube.com")) {
          return (
            <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
              <iframe
                src={getEmbedUrl(item.url)}
                title={item.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )
        } else {
          return (
            <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
              <Video className="h-12 w-12 text-gray-600" />
            </div>
          )
        }
      case "image":
        return (
          <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
            <img
              src={item.url || "/placeholder.svg?height=200&width=300"}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )
      case "documentary":
        return (
          <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center relative overflow-hidden">
            {item.thumbnail ? (
              <img src={item.thumbnail || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Film className="h-12 w-12 text-gray-600" />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gold/80 flex items-center justify-center">
                <Film className="h-6 w-6 text-black" />
              </div>
            </div>
          </div>
        )
      case "paper":
      default:
        return (
          <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-lg flex items-center justify-center p-6 text-center">
            <FileText className="h-12 w-12 text-gray-600 mb-2" />
          </div>
        )
    }
  }

  return (
    <>
      <div
        className={`bg-gray-900 border ${
          isSelected ? "border-gold" : "border-gray-800"
        } rounded-lg overflow-hidden shadow-lg card-hover animate-fade-in relative`}
        style={{ animationDelay: `${index * 0.05}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Selection checkbox */}
        {isSelecting && (
          <div className="absolute top-2 left-2 z-20">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(item.id)}
              className="h-5 w-5 accent-gold"
            />
          </div>
        )}

        {/* Favorite badge */}
        {item.favorite && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-gold text-black rounded-full p-1">
              <BookmarkIcon className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Featured badge */}
        {item.featured && (
          <div className="absolute top-2 right-10 z-10">
            <div className="bg-gold/80 text-black rounded-full p-1">
              <Star className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Preview section */}
        {renderPreview()}

        {/* Content section */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center mb-2">
              {getIcon()}
              <span className="text-xs font-medium text-gray-400 ml-1 uppercase">{item.type}</span>
            </div>

            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)} className="p-1 rounded-full hover:bg-gray-800">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-1 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-700"
                  >
                    <BookmarkIcon className={`h-4 w-4 mr-2 ${item.favorite ? "text-gold" : ""}`} />
                    {item.favorite ? "Remove Favorite" : "Add Favorite"}
                  </button>
                  <button
                    onClick={() => toggleFeatured(item.id)}
                    className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-700"
                  >
                    <Star className={`h-4 w-4 mr-2 ${item.featured ? "text-gold" : ""}`} />
                    {item.featured ? "Remove Featured" : "Add Featured"}
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(true)
                      setShowOptions(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
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

          <h3 className="font-bold text-lg mb-1 text-white line-clamp-2">{item.title}</h3>

          {item.description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>}

          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-gray-800 text-gold px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>

              {/* View count */}
              {typeof item.viewCount === "number" && (
                <span className="text-xs text-gray-500 flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {item.viewCount}
                </span>
              )}
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs font-medium text-gold hover:underline"
              onClick={handleViewClick}
            >
              View <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>

        {/* Hover overlay with quick actions */}
        {isHovered && !isSelecting && (
          <div className="absolute top-2 right-2 flex space-x-1 bg-gray-900/80 backdrop-blur-sm rounded-md p-1 animate-fade-in">
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`p-1 rounded-full ${item.favorite ? "text-gold" : "text-gray-400 hover:text-gold"}`}
              title={item.favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <BookmarkIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleFeatured(item.id)}
              className={`p-1 rounded-full ${item.featured ? "text-gold" : "text-gray-400 hover:text-gold"}`}
              title={item.featured ? "Remove from featured" : "Add to featured"}
            >
              <Star className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1 rounded-full text-gray-400 hover:text-white"
              title="Edit item"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="p-1 rounded-full text-gray-400 hover:text-red-400"
              title="Delete item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {showEditModal && <EditModal item={item} closeModal={() => setShowEditModal(false)} />}
    </>
  )
}

export default ResearchCard
