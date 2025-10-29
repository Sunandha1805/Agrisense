"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

interface SoilHealthPageProps {
  userData: any
}

export function SoilHealthPage({ userData }: SoilHealthPageProps) {
  const soilMetrics = [
    { name: "Nitrogen (N)", value: 100, unit: "kg/ha", status: "Optimal", color: "green" },
    { name: "Phosphorus (P)", value: 45, unit: "kg/ha", status: "Low", color: "yellow" },
    { name: "Potassium (K)", value: 48, unit: "kg/ha", status: "Low", color: "yellow" },
    { name: "Acidity (pH)", value: 7.5, unit: "", status: "Optimal", color: "green" },
    { name: "Moisture", value: 62.43, unit: "%", status: "Optimal", color: "green" },
    { name: "Rainfall", value: 0, unit: "mm", status: "Low", color: "yellow" },
  ]

  const radarData = [
    { name: "Nitrogen", value: 100 },
    { name: "Phosphorus", value: 45 },
    { name: "Potassium", value: 48 },
    { name: "pH", value: 75 },
    { name: "Moisture", value: 62 },
    { name: "Rainfall", value: 30 },
  ]

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Soil Nutrient Analysis</h1>
        <p className="text-gray-600">Monitor your soil health and nutrient levels</p>
      </div>

      {/* Soil Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {soilMetrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                    {metric.unit}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    metric.color === "green" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {metric.status}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full ${metric.color === "green" ? "bg-green-500" : "bg-yellow-500"}`}
                  style={{ width: `${Math.min(metric.value / 2, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Soil Health Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Soil Health (%)</CardTitle>
          <CardDescription>Comprehensive soil quality assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Soil Score" dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Based on your soil analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Leaf className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Phosphorus is deficient</p>
                <p className="text-sm text-green-800">Apply DAP or superphosphate.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Leaf className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Potassium is low</p>
                <p className="text-sm text-green-800">Muriate of potash (MOP) can improve the levels.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
