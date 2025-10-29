"use client"

import { LayoutDashboard, Leaf, Droplets, Cloud, BarChart3, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  onLogout: () => void
  userData: any
}

export function Sidebar({ currentPage, onPageChange, onLogout, userData }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "crop-analysis", label: "Crop Analysis", icon: Leaf },
    { id: "soil-health", label: "Soil Health", icon: Droplets },
    { id: "weather", label: "Weather", icon: Cloud },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? "bg-teal-50 text-teal-700 border-l-4 border-teal-500"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer - Logout button */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  )
}
