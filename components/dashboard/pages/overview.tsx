"use client"

import type React from "react"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, MapPin, Thermometer, Droplets } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface OverviewPageProps {
  userData: any
  weatherData: any
}

export function OverviewPage({ userData, weatherData }: OverviewPageProps) {
  const [cropRecommendations, setCropRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showYieldForm, setShowYieldForm] = useState(false)
  const [yieldData, setYieldData] = useState([
    { year: 2022, yield: 45 },
    { year: 2023, yield: 48 },
    { year: 2024, yield: 50 },
  ])
  const [yieldFormData, setYieldFormData] = useState({
    cropName: userData?.cropType || "Rice",
    cropVariety: "",
    season: "Kharif",
    startYear: 2020,
    endYear: 2024,
    landArea: userData?.farmArea || 150,
  })

  const cropOptions = ["Rice", "Wheat", "Corn", "Sugarcane", "Cotton", "Groundnut", "Sunflower", "Maize"]
  const seasonOptions = ["Kharif", "Rabi", "Summer"]
  const yearOptions = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 19 + i)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const cachedRecommendations = localStorage.getItem("cropRecommendations")
        const cacheTimestamp = localStorage.getItem("cropRecommendationsTime")
        const now = Date.now()

        if (cachedRecommendations && cacheTimestamp) {
          const cacheAge = now - Number.parseInt(cacheTimestamp)
          if (cacheAge < 24 * 60 * 60 * 1000) {
            setCropRecommendations(JSON.parse(cachedRecommendations))
            setLoading(false)
            return
          }
        }

        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: {
              city: userData?.city || "Bengaluru",
              state: userData?.state || "Karnataka",
            },
            soilData: {
              nitrogen: 100,
              phosphorus: 45,
              potassium: 48,
              ph: 7.5,
            },
            weatherData,
            farmArea: userData?.farmArea || "150",
            currentCrop: userData?.cropType,
          }),
        })

        const data = await response.json()
        if (data.recommendations) {
          localStorage.setItem("cropRecommendations", JSON.stringify(data.recommendations))
          localStorage.setItem("cropRecommendationsTime", now.toString())
          setCropRecommendations(data.recommendations)
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error)
        const fallbackRecommendations = [
          { name: "Wheat", score: 87, reason: "Optimal soil pH and temperature" },
          { name: "Rice", score: 80, reason: "Good moisture retention" },
          { name: "Corn", score: 80, reason: "Suitable for current season" },
        ]
        localStorage.setItem("cropRecommendations", JSON.stringify(fallbackRecommendations))
        localStorage.setItem("cropRecommendationsTime", Date.now().toString())
        setCropRecommendations(fallbackRecommendations)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [userData, weatherData])

  const handleYieldFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate yield data based on form inputs
    const years = []
    for (let i = yieldFormData.startYear; i <= yieldFormData.endYear; i++) {
      years.push({
        year: i,
        yield: Math.floor(Math.random() * 30 + 40),
      })
    }
    setYieldData(years)
    setShowYieldForm(false)
  }

  return (
    <div className="p-8 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-6 border border-teal-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userData?.fullName}! 👋</h1>
            <p className="text-gray-600">
              Here is your farm's live status in {userData?.city}, {userData?.state}.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Yield Prediction</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Recommend Crop</Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Primary Crop</p>
                <p className="text-2xl font-bold text-gray-900">{userData?.cropType || "Rice"}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Farm Area</p>
                <p className="text-2xl font-bold text-gray-900">{userData?.farmArea || "150"} ha</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Temp</p>
                <p className="text-2xl font-bold text-gray-900">{weatherData?.temperature_2m || "25.2"}°C</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Thermometer className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Humidity</p>
                <p className="text-2xl font-bold text-gray-900">{weatherData?.relative_humidity_2m || "74"}%</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Yield Comparison */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Yield Comparison (Quintal/Hectare)</CardTitle>
            <CardDescription>Your farm's yield over the past years</CardDescription>
          </CardHeader>
          <CardContent>
            {!showYieldForm ? (
              <div className="space-y-4">
                {yieldData.length === 3 && yieldData[0].year === 2022 ? (
                  <>
                    <p className="text-gray-600 text-center py-8">Compare yield for the last few years</p>
                    <Button
                      onClick={() => setShowYieldForm(true)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Compare Yield
                    </Button>
                  </>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={yieldData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="yield" stroke="#14b8a6" strokeWidth={2} name="Your Yield" />
                      </LineChart>
                    </ResponsiveContainer>
                    <Button
                      onClick={() => setShowYieldForm(true)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Adjust Comparison
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleYieldFormSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Crop Name</label>
                  <select
                    value={yieldFormData.cropName}
                    onChange={(e) => setYieldFormData({ ...yieldFormData, cropName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {cropOptions.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Crop Variety</label>
                  <Input
                    type="text"
                    value={yieldFormData.cropVariety}
                    onChange={(e) => setYieldFormData({ ...yieldFormData, cropVariety: e.target.value })}
                    placeholder="e.g., Basmati, Hybrid"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Season</label>
                  <select
                    value={yieldFormData.season}
                    onChange={(e) => setYieldFormData({ ...yieldFormData, season: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {seasonOptions.map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Start Year</label>
                    <select
                      value={yieldFormData.startYear}
                      onChange={(e) =>
                        setYieldFormData({ ...yieldFormData, startYear: Number.parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">End Year</label>
                    <select
                      value={yieldFormData.endYear}
                      onChange={(e) => setYieldFormData({ ...yieldFormData, endYear: Number.parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Land Area (Hectares)</label>
                  <Input
                    type="number"
                    value={yieldFormData.landArea}
                    onChange={(e) =>
                      setYieldFormData({ ...yieldFormData, landArea: Number.parseFloat(e.target.value) })
                    }
                    placeholder="e.g., 150"
                    step="0.1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    Generate Comparison
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowYieldForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Top 3 Crop Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Top 3 Crop Recommendations</CardTitle>
            <CardDescription>Based on your location</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-500">Loading recommendations...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cropRecommendations} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
