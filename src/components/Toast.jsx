"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"

// Create a context for toast notifications
const ToastContext = createContext()

// Toast component
const Toast = ({ message, type, onClose, id }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  return (
    <div
      className={`flex items-center justify-between p-4 mb-3 rounded-lg shadow-lg animate-slide-up ${
        type === "success"
          ? "bg-green-100 dark:bg-green-900/80 text-green-800 dark:text-green-200"
          : "bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200"
      }`}
    >
      <div className="flex items-center">
        {type === "success" ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
        <span>{message}</span>
      </div>
      <button onClick={() => onClose(id)} className="ml-4 hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast container component
export const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext()

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  )
}

// Toast provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = "success") => {
    const id = Date.now().toString()
    setToasts((prevToasts) => [...prevToasts, { id, message, type }])
    return id
  }

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

// Custom hook to use toast context
export const useToastContext = () => useContext(ToastContext)

// Function to show toast from anywhere
export const showToast = (message, type = "success") => {
  // Create a temporary div to render the toast
  const div = document.createElement("div")
  div.className = "toast-message"
  document.body.appendChild(div)

  // Create a custom event to trigger the toast
  const event = new CustomEvent("show-toast", {
    detail: { message, type },
  })
  document.dispatchEvent(event)

  // Clean up
  setTimeout(() => {
    document.body.removeChild(div)
  }, 100)
}

// Listen for toast events
if (typeof window !== "undefined") {
  document.addEventListener("show-toast", (e) => {
    const { message, type } = e.detail
    const toastContainer = document.querySelector(".toast-container")
    if (toastContainer) {
      const toast = document.createElement("div")
      toast.className = `toast ${type}`
      toast.textContent = message
      toastContainer.appendChild(toast)
      setTimeout(() => {
        toast.remove()
      }, 5000)
    }
  })
}
