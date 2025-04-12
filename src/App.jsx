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
import { ToastProvider } from "./components/Toast" // ✅ Wrap your app in this
import BackgroundAnimation from "./components/BackgroundAnimation"
import FeaturedCarousel from "./components/FeaturedCarousel"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showFeatured, setShowFeatured] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const toggleImportExport = () => setIsImportExportOpen(!isImportExportOpen)
  const toggleFeatured = () => {
    setShowFeatured(!showFeatured)
    localStorage.setItem("showFeatured", !showFeatured ? "true" : "false")
  }
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("darkMode", newMode ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newMode)
  }

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      const isDark = savedMode === "dark"
      setIsDarkMode(isDark)
      document.documentElement.classList.toggle("dark", isDark)
    } else {
      document.documentElement.classList.add("dark")
    }

    const featuredPref = localStorage.getItem("showFeatured")
    if (featuredPref !== null) {
      setShowFeatured(featuredPref === "true")
    }

    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setShowWelcome(true)
      localStorage.setItem("hasVisited", "true")
    }

    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <ToastProvider>
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
        </div>
      </ResearchProvider>
    </ToastProvider>
  )
}

export default App
