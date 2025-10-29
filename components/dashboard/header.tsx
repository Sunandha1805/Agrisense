"use client"

import { Leaf, MapPin, RotateCcw, Bell } from "lucide-react"

interface HeaderProps {
  userData: any
  onLogout: () => void
  onRefresh?: () => void
}

export function Header({ userData, onLogout, onRefresh }: HeaderProps) {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      window.location.reload()
    }
  }

  const getLocation = () => {
    try {
      const savedLocation = localStorage.getItem("userLocation")
      if (savedLocation) {
        const { city, state } = JSON.parse(savedLocation)
        return `${city}, ${state}`
      }
    } catch (error) {
      console.error("Failed to get location from localStorage:", error)
    }
    return userData?.city && userData?.state ? `${userData.city}, ${userData.state}` : "Bengaluru, Karnataka"
  }

  const location = getLocation()
  const userInitial = userData?.fullName?.charAt(0) || "R"
  const userName = userData?.fullName || "Robi"

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">AgriSense</h1>
      </div>

      {/* Right side - Location, Refresh, Notifications, Profile */}
      <div className="flex items-center gap-6">
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-5 h-5 text-teal-500" />
          <span className="text-sm font-medium">{location}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RotateCcw className="w-5 h-5 text-gray-600 hover:text-teal-500" />
        </button>

        {/* Notification Bell */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" title="Notifications">
          <Bell className="w-5 h-5 text-gray-600 hover:text-teal-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {userInitial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">farmer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
