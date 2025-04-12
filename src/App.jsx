"use client"

import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import MainContent from "./components/MainContent"
import UploadModal from "./components/UploadModal"
import ScrollToTop from "./components/ScrollToTop"
import { ResearchProvider } from "./context/ResearchContext"
import WelcomeModal from "./components/WelcomeModal"
import ImportExportModal from "./components/ImportExportModal"
import { ToastContainer } from "./components/Toast"
import BackgroundAnimation from "./components/BackgroundAnimation"
import FeaturedCarousel from "./components/FeaturedCarousel"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showFeatured, setShowFeatured] = useState(true)

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Toggle modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  // Toggle import/export modal
  const toggleImportExport = () => {
    setIsImportExportOpen(!isImportExportOpen)
  }

  // Toggle featured carousel
  const toggleFeatured = () => {
    setShowFeatured(!showFeatured)
    localStorage.setItem("showFeatured", !showFeatured ? "true" : "false")
  }

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("darkMode", newMode ? "dark" : "light")
    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Set initial dark mode and check if first visit
  useEffect(() => {
    // Check for dark mode preference
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      const isDark = savedMode === "dark"
      setIsDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } else {
      // Default to dark mode
      document.documentElement.classList.add("dark")
    }

    // Check featured carousel preference
    const featuredPref = localStorage.getItem("showFeatured")
    if (featuredPref !== null) {
      setShowFeatured(featuredPref === "true")
    }

    // Check if first visit
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setShowWelcome(true)
      localStorage.setItem("hasVisited", "true")
    }

    // Check screen size for sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <ResearchProvider>
      <div className={`flex flex-col min-h-screen transition-theme ${isDarkMode ? "dark bg-dark-bg" : "bg-gray-100"}`}>
        <BackgroundAnimation />
        <Navbar
          toggleSidebar={toggleSidebar}
          toggleModal={toggleModal}
          toggleImportExport={toggleImportExport}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          toggleFeatured={toggleFeatured}
          showFeatured={showFeatured}
        />
        {showFeatured && <FeaturedCarousel />}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} />
          <MainContent />
        </div>
        {isModalOpen && <UploadModal closeModal={toggleModal} />}
        {isImportExportOpen && <ImportExportModal closeModal={toggleImportExport} />}
        {showWelcome && <WelcomeModal closeModal={() => setShowWelcome(false)} />}
        <ScrollToTop />
        <ToastContainer />
      </div>
    </ResearchProvider>
  )
}

export default App
