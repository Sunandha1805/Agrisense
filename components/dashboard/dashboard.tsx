"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { OverviewPage } from "./pages/overview"
import { CropAnalysisPage } from "./pages/crop-analysis"
import { SoilHealthPage } from "./pages/soil-health"
import { WeatherPage } from "./pages/weather"
import { AnalyticsPage } from "./pages/analytics"
import { ChatBot } from "./chatbot"
import { Header } from "./header"

interface DashboardProps {
  userData: any
  onLogout: () => void
}

export function Dashboard({ userData, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState("overview")
  const [weatherData, setWeatherData] = useState<any>(null)
  const [showChat, setShowChat] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
    // Refetch weather data
    const fetchWeather = async () => {
      try {
        const lat = userData?.latitude || 12.9716
        const lon = userData?.longitude || 77.5946

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`,
        )
        const data = await response.json()
        setWeatherData(data.current)
      } catch (error) {
        console.error("Failed to fetch weather:", error)
      }
    }
    fetchWeather()
  }

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = userData?.latitude || 12.9716
        const lon = userData?.longitude || 77.5946

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`,
        )
        const data = await response.json()
        setWeatherData(data.current)
      } catch (error) {
        console.error("Failed to fetch weather:", error)
      }
    }

    fetchWeather()
  }, [userData, refreshTrigger])

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <OverviewPage userData={userData} weatherData={weatherData} />
      case "crop-analysis":
        return <CropAnalysisPage userData={userData} />
      case "soil-health":
        return <SoilHealthPage userData={userData} />
      case "weather":
        return <WeatherPage userData={userData} weatherData={weatherData} />
      case "analytics":
        return <AnalyticsPage userData={userData} />
      default:
        return <OverviewPage userData={userData} weatherData={weatherData} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header userData={userData} onLogout={onLogout} onRefresh={handleRefresh} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} onLogout={onLogout} userData={userData} />
        <div className="flex-1 overflow-auto">{renderPage()}</div>
      </div>
      <ChatBot isOpen={showChat} onToggle={() => setShowChat(!showChat)} />
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  )
}
