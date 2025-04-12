"use client"

import { useState } from "react"
import { useResearch } from "../context/ResearchContext"
import { X, Download, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { showToast } from "./Toast"

const ImportExportModal = ({ closeModal }) => {
  const { allItems, exportItems, importItems } = useResearch()
  const [activeTab, setActiveTab] = useState("export")
  const [importData, setImportData] = useState("")
  const [exportFormat, setExportFormat] = useState("json")
  const [selectedItems, setSelectedItems] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [exportStatus, setExportStatus] = useState({ show: false, type: "", message: "" })
  const [importStatus, setImportStatus] = useState({ show: false, type: "", message: "" })

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setExportStatus({ show: false, type: "", message: "" })
    setImportStatus({ show: false, type: "", message: "" })
  }

  // Handle select all items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(allItems.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle individual item selection
  const handleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
      setSelectAll(false)
    } else {
      setSelectedItems([...selectedItems, id])
      if (selectedItems.length + 1 === allItems.length) {
        setSelectAll(true)
      }
    }
  }

  // Handle export
  const handleExport = () => {
    try {
      const itemsToExport = selectedItems.length > 0 ? selectedItems : null
      const { data, count } = exportItems(itemsToExport)

      if (count === 0) {
        setExportStatus({
          show: true,
          type: "error",
          message: "No items selected for export",
        })
        return
      }

      let dataStr, fileName, mimeType

      if (exportFormat === "json") {
        dataStr = JSON.stringify(data, null, 2)
        fileName = `research_archive_${new Date().toISOString().slice(0, 10)}.json`
        mimeType = "application/json"
      } else if (exportFormat === "csv") {
        // Convert to CSV
        const headers = ["id", "type", "title", "tags", "category", "description", "url", "createdAt", "viewCount"]
        const rows = data.map((item) => {
          return headers.map((header) => {
            if (header === "tags") {
              return JSON.stringify(item[header])
            }
            return item[header]
          })
        })
        dataStr = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
        fileName = `research_archive_${new Date().toISOString().slice(0, 10)}.csv`
        mimeType = "text/csv"
      }

      const blob = new Blob([dataStr], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      link.click()

      setExportStatus({
        show: true,
        type: "success",
        message: `Successfully exported ${count} items`,
      })
      showToast(`Successfully exported ${count} items`, "success")
    } catch (error) {
      console.error("Export error:", error)
      setExportStatus({
        show: true,
        type: "error",
        message: `Export failed: ${error.message}`,
      })
      showToast(`Export failed: ${error.message}`, "error")
    }
  }

  // Handle import
  const handleImport = () => {
    try {
      if (!importData.trim()) {
        setImportStatus({
          show: true,
          type: "error",
          message: "Please enter data to import",
        })
        return
      }

      const data = JSON.parse(importData)
      const success = importItems(data)

      if (success) {
        setImportStatus({
          show: true,
          type: "success",
          message: "Data imported successfully",
        })
        setImportData("")
      }
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus({
        show: true,
        type: "error",
        message: `Import failed: ${error.message}`,
      })
    }
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        setImportData(event.target.result)
      } catch (error) {
        console.error("File reading error:", error)
        setImportStatus({
          show: true,
          type: "error",
          message: "Failed to read file",
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="text-xl font-bold text-gold">Import & Export</h2>
          <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-800 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => handleTabChange("export")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "export"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Download className="h-4 w-4 inline mr-2" />
            Export
          </button>
          <button
            onClick={() => handleTabChange("import")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "import"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Import
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Export Tab */}
          {activeTab === "export" && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Export Format</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="json"
                      checked={exportFormat === "json"}
                      onChange={() => setExportFormat("json")}
                      className="mr-2 accent-gold"
                    />
                    <span>JSON</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="csv"
                      checked={exportFormat === "csv"}
                      onChange={() => setExportFormat("csv")}
                      className="mr-2 accent-gold"
                    />
                    <span>CSV</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Select Items to Export</label>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="mr-2 accent-gold"
                    />
                    Select All
                  </label>
                </div>

                <div className="border border-gray-800 rounded-lg max-h-60 overflow-y-auto">
                  {allItems.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 text-left">
                        <tr>
                          <th className="p-2 w-10"></th>
                          <th className="p-2">Title</th>
                          <th className="p-2">Type</th>
                          <th className="p-2">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allItems.map((item) => (
                          <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                            <td className="p-2">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleItemSelection(item.id)}
                                className="accent-gold"
                              />
                            </td>
                            <td className="p-2">{item.title}</td>
                            <td className="p-2 capitalize">{item.type}</td>
                            <td className="p-2">{item.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-4 text-center text-gray-500">No items to export</p>
                  )}
                </div>
              </div>

              {exportStatus.show && (
                <div
                  className={`p-3 mb-4 rounded-md flex items-center ${
                    exportStatus.type === "success"
                      ? "bg-green-900/30 text-green-300 border border-green-800"
                      : "bg-red-900/30 text-red-300 border border-red-800"
                  }`}
                >
                  {exportStatus.type === "success" ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <span>{exportStatus.message}</span>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-gradient-to-r from-gold-dark to-gold text-black font-medium rounded-md hover:shadow-lg hover:shadow-gold/20 transition-all"
                  disabled={allItems.length === 0}
                >
                  <Download className="h-4 w-4 inline mr-2" />
                  Export {selectedItems.length > 0 ? `(${selectedItems.length} items)` : "All"}
                </button>
              </div>
            </div>
          )}

          {/* Import Tab */}
          {activeTab === "import" && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload JSON File</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Or paste JSON data</label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows="10"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                  placeholder='[{"id": "1", "title": "Example", "type": "paper", ...}]'
                ></textarea>
              </div>

              {importStatus.show && (
                <div
                  className={`p-3 mb-4 rounded-md flex items-center ${
                    importStatus.type === "success"
                      ? "bg-green-900/30 text-green-300 border border-green-800"
                      : "bg-red-900/30 text-red-300 border border-red-800"
                  }`}
                >
                  {importStatus.type === "success" ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-gradient-to-r from-gold-dark to-gold text-black font-medium rounded-md hover:shadow-lg hover:shadow-gold/20 transition-all"
                  disabled={!importData.trim()}
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Import Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImportExportModal
