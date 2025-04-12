"use client"

import { useState } from "react"
import { useResearch } from "../context/ResearchContext"
import { X, FileText, Video, Film, ImageIcon } from "lucide-react"

const EditModal = ({ item, closeModal }) => {
  const { updateItem } = useResearch()

  const [formData, setFormData] = useState({
    ...item,
    tags: item.tags.join(", "),
  })

  const [errors, setErrors] = useState({})

  const contentTypes = [
    { id: "paper", name: "Paper", icon: <FileText className="h-5 w-5" /> },
    { id: "video", name: "Video", icon: <Video className="h-5 w-5" /> },
    { id: "documentary", name: "Documentary", icon: <Film className="h-5 w-5" /> },
    { id: "image", name: "Image", icon: <ImageIcon className="h-5 w-5" /> },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.tags.trim()) {
      newErrors.tags = "At least one tag is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Process tags (split by comma and trim)
    const processedTags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")

    // Update item
    const updatedItem = {
      ...formData,
      tags: processedTags,
    }

    updateItem(updatedItem)
    closeModal()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="text-xl font-bold text-gold">Edit Research Item</h2>
          <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-800 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Content Type</label>
            <div className="grid grid-cols-4 gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                    formData.type === type.id
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {type.icon}
                  <span className="text-xs mt-1">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.title ? "border-red-500" : "border-gray-700"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-gold`}
              placeholder="Enter title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.tags ? "border-red-500" : "border-gray-700"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-gold`}
              placeholder="AI, Research, Technology"
            />
            {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.category ? "border-red-500" : "border-gray-700"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-gold`}
              placeholder="Enter category"
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="Enter description"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
              URL / Link
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.url ? "border-red-500" : "border-gray-700"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-gold`}
              placeholder="https://example.com/resource"
            />
            {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
          </div>

          {(formData.type === "video" || formData.type === "documentary") && (
            <div className="mb-4">
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-1">
                Thumbnail URL (optional)
              </label>
              <input
                type="text"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-gold-dark to-gold text-black font-medium rounded-md hover:shadow-lg hover:shadow-gold/20 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditModal
