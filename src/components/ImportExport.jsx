"use client"

import { useState } from "react"
import { useResearch } from "../context/ResearchContext"
import { Download, Upload, AlertCircle, CheckCircle } from "lucide-react"

const ImportExport = () => {
  const { researchItems, importResearchItems } = useResearch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [importData, setImportData] = useState("")
  const [notification, setNotification] = useState({ show: false, type: "", message: "" })

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(researchItems, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = `research_archive_${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      showNotification("success", "Data exported successfully!")
    } catch (error) {
      console.error("Export error:", error)
      showNotification("error", "Failed to export data")
    }
  }

  const handleImport = () => {
    try {
      const data = JSON.parse(importData)

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format")
      }

      importResearchItems(data)
      setIsModalOpen(false)
      setImportData("")
      showNotification("success", "Data imported successfully!")
    } catch (error) {
      console.error("Import error:", error)
      showNotification("error", "Failed to import data. Please check the format.")
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        setImportData(event.target.result)
      } catch (error) {
        console.error("File reading error:", error)
        showNotification("error", "Failed to read file")
      }
    }
    reader.readAsText(file)
  }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" })
    }, 3000)
  }

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <button
          onClick={exportData}
          className="flex items-center px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200"
          title="Export data"
        >
          <Download className="w-5 h-5 mr-1" />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors duration-200"
          title="Import data"
        >
          <Upload className="w-5 h-5 mr-1" />
          <span className="hidden sm:inline">Import</span>
        </button>
      </div>

      {/* Import Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Import Research Data</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload JSON File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 dark:file:bg-yellow-900 dark:file:text-yellow-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Or paste JSON data
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="w-full h-40 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder='[{"id": "1", "title": "Example", ...}]'
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg animate-slide-up z-50 ${
            notification.type === "success"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  )
}

export default ImportExport
