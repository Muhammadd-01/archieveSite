"use client"

import { useState, useEffect, useRef } from "react"
import { useResearch } from "../context/ResearchContext"
import { Star, ArrowLeft, ArrowRight } from "lucide-react"

const FeaturedCarousel = () => {
  const { featuredItems, incrementViewCount } = useResearch()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef(null)
  const touchStartX = useRef(0)

  // Handle auto-rotation
  useEffect(() => {
    if (isAutoPlaying && featuredItems.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length)
      }, 5000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, featuredItems.length])

  // Pause auto-rotation when hovering
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredItems.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (diff > 50) {
      goToNext()
    } else if (diff < -50) {
      goToPrevious()
    }
  }

  // Handle view click
  const handleViewClick = (id) => {
    incrementViewCount(id)
  }

  // If no featured items, don't render the carousel
  if (featuredItems.length === 0) {
    return null
  }

  return (
    <div
      className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 relative">
        <div className="flex items-center mb-4">
          <Star className="h-5 w-5 text-gold mr-2" />
          <h2 className="text-xl font-bold text-white">Featured Research</h2>
        </div>

        <div className="relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredItems.map((item, index) => (
              <div
                key={item.id}
                className="w-full flex-shrink-0 relative"
                style={{ width: "100%" }} // Ensure each item takes full width
              >
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  {item.type === "video" && item.url && item.url.includes("youtube.com") ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.url.split("v=")[1]}`}
                      title={item.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <img
                      src={item.thumbnail || item.url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-lg font-bold text-white line-clamp-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-gold hover:underline"
                      onClick={() => handleViewClick(item.id)}
                    >
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          {featuredItems.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                aria-label="Previous Slide"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                aria-label="Next Slide"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Indicators */}
          {featuredItems.length > 1 && (
            <div className="absolute bottom-2 left-0 w-full flex justify-center space-x-2">
              {featuredItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    currentIndex === index ? "bg-gold" : "bg-gray-500 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeaturedCarousel
