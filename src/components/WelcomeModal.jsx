"use client"

import { useState } from "react"
import { X, BookOpen, Search, Tag, Star, FileText, Video, Film, ImageIcon } from "lucide-react"

const WelcomeModal = ({ closeModal }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Research Archive",
      description:
        "Your personal space to collect, organize, and discover research materials. This quick tour will help you get started.",
      icon: <BookOpen className="h-12 w-12 text-gold" />,
    },
    {
      title: "Add Research Items",
      description:
        "Add papers, videos, documentaries, and images to your archive. Organize them with tags and categories for easy access.",
      icon: <FileText className="h-12 w-12 text-gold" />,
    },
    {
      title: "Search & Filter",
      description:
        "Quickly find what you need with powerful search and filtering options. Filter by content type, category, date, and more.",
      icon: <Search className="h-12 w-12 text-gold" />,
    },
    {
      title: "Organize with Tags",
      description:
        "Use tags to create connections between different research items. Build your own knowledge graph over time.",
      icon: <Tag className="h-12 w-12 text-gold" />,
    },
    {
      title: "Feature Important Items",
      description:
        "Mark important items as featured to keep them easily accessible. Featured items appear in the carousel at the top.",
      icon: <Star className="h-12 w-12 text-gold" />,
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      closeModal()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg w-full max-w-2xl overflow-hidden animate-fade-in">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left sidebar with steps */}
          <div className="bg-gray-900 p-6 md:w-1/3">
            <h3 className="text-lg font-bold text-gold mb-4">Get Started</h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-all ${
                    currentStep === index ? "bg-gold/20 text-gold font-medium" : "hover:bg-gray-800 text-gray-400"
                  }`}
                >
                  {index + 1}. {step.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 md:w-2/3">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="mb-4 p-4 bg-gray-800 rounded-full">{steps[currentStep].icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h2>
              <p className="text-gray-300">{steps[currentStep].description}</p>
            </div>

            {/* Content type icons for step 2 */}
            {currentStep === 1 && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center p-3 bg-gray-800 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-400 mb-2" />
                  <span className="text-xs text-gray-300">Papers</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-800 rounded-lg">
                  <Video className="h-8 w-8 text-red-400 mb-2" />
                  <span className="text-xs text-gray-300">Videos</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-800 rounded-lg">
                  <Film className="h-8 w-8 text-purple-400 mb-2" />
                  <span className="text-xs text-gray-300">Documentaries</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-800 rounded-lg">
                  <ImageIcon className="h-8 w-8 text-green-400 mb-2" />
                  <span className="text-xs text-gray-300">Images</span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className={`px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors ${
                  currentStep === 0 ? "invisible" : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-gradient-to-r from-gold-dark to-gold text-black font-medium rounded-md hover:shadow-lg hover:shadow-gold/20 transition-all"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
