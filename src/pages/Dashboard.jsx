import { useState } from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/dashboard/Sidebar"
import { FiMenu, FiX } from "react-icons/fi"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] flex-col md:flex-row w-full">
      {/* Mobile Dashboard Navigation Header */}
      <div className="flex md:hidden items-center justify-between border-b border-white/5 bg-[#0B0A10]/95 px-6 py-4 z-40 w-full shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-sm font-semibold text-[#A78BFA] transition-colors hover:text-white"
        >
          {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          <span>Dashboard Menu</span>
        </button>
      </div>

      {/* Sidebar - Pass state and close callback */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main content viewport */}
      <div className="h-[calc(100vh-5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-6 md:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard