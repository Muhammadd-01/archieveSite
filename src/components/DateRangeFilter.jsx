"use client"

import { useState, useEffect, useRef } from "react"
import { useResearch } from "../context/ResearchContext"
import { Calendar, ChevronDown, X } from "lucide-react"

const DateRangeFilter = () => {
  const { setDateFilter } = useResearch()
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [activeFilter, setActiveFilter] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const applyFilter = () => {
    if (startDate || endDate) {
      setDateFilter({ start: startDate, end: endDate })
      setActiveFilter(true)
      setIsOpen(false)
    }
  }

  const clearFilter = () => {
    setStartDate("")
    setEndDate("")
    setDateFilter({ start: "", end: "" })
    setActiveFilter(false)
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value)
    if (endDate && new Date(e.target.value) > new Date(endDate)) {
      setEndDate(e.target.value)
    }
  }

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value)
    if (startDate && new Date(e.target.value) < new Date(startDate)) {
      setStartDate(e.target.value)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
          activeFilter
            ? "bg-yellow-600 text-white hover:bg-yellow-700"
            : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
        }`}
      >
        <Calendar className="w-5 h-5 mr-1" />
        <span className="hidden sm:inline">Date Filter</span>
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-4 animate-fade-in">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Filter by Date</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={clearFilter}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors duration-200"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </button>

            <button
              onClick={applyFilter}
              className="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {activeFilter && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter
