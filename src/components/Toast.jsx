import { useState, useEffect, createContext, useContext } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"

// Context
const ToastContext = createContext()

// Individual Toast
const Toast = ({ message, type, onClose, id }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000)
    return () => clearTimeout(timer)
  }, [id, onClose])

  return (
    <div
      className={`flex items-center justify-between p-4 mb-3 rounded-lg shadow-lg transition-all duration-300 animate-slide-up ${
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

// Toast Container
export const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext()

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  )
}

// Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = "success") => {
    const id = Date.now().toString()
    setToasts((prevToasts) => [...prevToasts, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Hook
export const useToastContext = () => useContext(ToastContext)
