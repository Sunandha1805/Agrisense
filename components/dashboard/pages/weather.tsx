"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud } from "lucide-react"

interface WeatherPageProps {
  userData: any
  weatherData: any
}

export function WeatherPage({ userData, weatherData }: WeatherPageProps) {
  const forecast = [
    { day: "Mon", high: 28, low: 18, condition: "Sunny", icon: "☀️" },
    { day: "Tue", high: 26, low: 16, condition: "Cloudy", icon: "☁️" },
    { day: "Wed", high: 24, low: 15, condition: "Rainy", icon: "🌧️" },
    { day: "Thu", high: 25, low: 17, condition: "Partly Cloudy", icon: "⛅" },
    { day: "Fri", high: 27, low: 18, condition: "Sunny", icon: "☀️" },
  ]

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Information</h1>
        <p className="text-gray-600">Current weather and forecast for {userData?.city}</p>
      </div>

      {/* Current Weather */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Temperature</p>
              <p className="text-3xl font-bold text-gray-900">{weatherData?.temperature_2m || "25.2"}°C</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Humidity</p>
              <p className="text-3xl font-bold text-gray-900">{weatherData?.relative_humidity_2m || "74"}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Wind Speed</p>
              <p className="text-3xl font-bold text-gray-900">12 km/h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Visibility</p>
              <p className="text-3xl font-bold text-gray-900">10 km</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
          <CardDescription>Weather prediction for the next 5 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {forecast.map((day, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold text-gray-900 mb-2">{day.day}</p>
                <p className="text-2xl mb-2">{day.icon}</p>
                <p className="text-sm text-gray-600 mb-2">{day.condition}</p>
                <div className="flex justify-center gap-2 text-sm">
                  <span className="font-semibold text-gray-900">{day.high}°</span>
                  <span className="text-gray-500">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Alerts</CardTitle>
          <CardDescription>Important weather notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Cloud className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">Light Rain Expected</p>
                <p className="text-sm text-yellow-800">Wednesday afternoon, 2-4 mm expected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
