"use client"

import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import MainContent from "./components/MainContent"
import UploadModal from "./components/UploadModal"
import ScrollToTop from "./components/ScrollToTop"
import { ResearchProvider } from "./context/ResearchContext"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Toggle modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Set initial dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <ResearchProvider>
      <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark bg-black" : "bg-gray-100"}`}>
        <Navbar
          toggleSidebar={toggleSidebar}
          toggleModal={toggleModal}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} />
          <MainContent />
        </div>
        {isModalOpen && <UploadModal closeModal={toggleModal} />}
        <ScrollToTop />
      </div>
    </ResearchProvider>
  )
}

export default App
