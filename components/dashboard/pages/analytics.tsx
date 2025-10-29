"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useState } from "react"

interface AnalyticsPageProps {
  userData: any
}

export function AnalyticsPage({ userData }: AnalyticsPageProps) {
  const [showAnalyticsForm, setShowAnalyticsForm] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [formData, setFormData] = useState({
    cropName: userData?.cropType || "",
    season: userData?.season || "",
    startYear: 2020,
    endYear: 2024,
    landArea: userData?.farmArea || "",
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate analytics data based on form inputs
    const yieldTrend = []
    for (let i = 0; i < 6; i++) {
      yieldTrend.push({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
        yield: Math.floor(Math.random() * 20 + 40),
      })
    }

    const cropComparison = [
      { crop: "Wheat", yield: 87 },
      { crop: "Rice", yield: 80 },
      { crop: "Corn", yield: 75 },
      { crop: "Barley", yield: 70 },
    ]

    setAnalyticsData({
      yieldTrend,
      cropComparison,
      totalYield: 7500,
      averageYield: 50,
      farmHealthScore: 85,
      soilQuality: "Good",
    })
    setShowAnalyticsForm(false)
  }

  if (showAnalyticsForm) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Detailed insights into your farm performance</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Farm Analytics Setup</CardTitle>
            <CardDescription>Provide details to generate your farm analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Crop Name</label>
                <Input
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  placeholder="e.g., Wheat"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Season</label>
                <Input
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  placeholder="e.g., Rabi"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Start Year</label>
                  <Input
                    type="number"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">End Year</label>
                  <Input
                    type="number"
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Land Area (Hectares)</label>
                <Input
                  type="number"
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  placeholder="e.g., 150"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  Generate Analytics
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Detailed insights into your farm performance</p>
      </div>

      {/* Yield Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Yield Trend (Last 6 Months)</CardTitle>
          <CardDescription>Your farm's yield progression</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData?.yieldTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="yield" stroke="#14b8a6" strokeWidth={2} name="Yield (Quintal/Ha)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Crop Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Crop Yield Comparison</CardTitle>
          <CardDescription>Performance across different crops</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData?.cropComparison || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="yield" fill="#10b981" name="Yield (Quintal/Ha)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Yield (2024)</p>
            <p className="text-2xl font-bold text-gray-900">{analyticsData?.totalYield || 0} Q</p>
            <p className="text-xs text-green-600 mt-2">↑ 5% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Average Yield</p>
            <p className="text-2xl font-bold text-gray-900">{analyticsData?.averageYield || 0} Q/Ha</p>
            <p className="text-xs text-green-600 mt-2">↑ 2% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Farm Health Score</p>
            <p className="text-2xl font-bold text-gray-900">{analyticsData?.farmHealthScore || 0}/100</p>
            <p className="text-xs text-green-600 mt-2">Excellent condition</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Soil Quality</p>
            <p className="text-2xl font-bold text-gray-900">{analyticsData?.soilQuality || "N/A"}</p>
            <p className="text-xs text-yellow-600 mt-2">Needs P & K boost</p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => setShowAnalyticsForm(true)} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
        Modify Analytics
      </Button>
    </div>
  )
}
