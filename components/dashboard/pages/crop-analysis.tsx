"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Camera, Loader2 } from "lucide-react"
import { useState, useRef } from "react"
import { Leaf } from "lucide-react"

interface CropAnalysisPageProps {
  userData: any
}

export function CropAnalysisPage({ userData }: CropAnalysisPageProps) {
  const [detectionResult, setDetectionResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = async (file: File) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    const fileReader = new FileReader()
    fileReader.onload = async (event) => {
      const base64String = event.target?.result as string
      await analyzeImage(base64String)
    }
    fileReader.readAsDataURL(file)
  }

  const analyzeImage = async (imageBase64: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/disease-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          plantType: userData?.cropType || "Unknown",
        }),
      })

      const data = await response.json()
      setDetectionResult(data)
    } catch (error) {
      console.error("Error analyzing image:", error)
      setDetectionResult({
        disease: "Analysis Failed",
        confidence: 0,
        severity: "mild",
        treatment: "Please try again with a clearer image",
        preventionTips: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crop Analysis</h1>
        <p className="text-gray-600">Monitor your crops and detect diseases early</p>
      </div>

      {/* Plant Disease Detection */}
      <Card>
        <CardHeader>
          <CardTitle>Plant Disease Detection</CardTitle>
          <CardDescription>Upload or capture an image to detect plant diseases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Leaf size={18} className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 mb-4">Upload a plant image to analyze</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    <Camera size={18} />
                    Start Camera
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                  >
                    <Upload size={18} />
                    Upload Image
                  </Button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Plant preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    onClick={() => {
                      setImagePreview(null)
                      setDetectionResult(null)
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Clear
                  </Button>
                </div>

                {loading && (
                  <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin mr-2 text-blue-600" />
                    <p className="text-blue-600">Analyzing image...</p>
                  </div>
                )}

                {detectionResult && !loading && (
                  <div
                    className={`border rounded-lg p-4 ${
                      detectionResult.disease === "Healthy Plant"
                        ? "bg-green-50 border-green-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <h3
                      className={`font-semibold mb-2 ${
                        detectionResult.disease === "Healthy Plant" ? "text-green-900" : "text-yellow-900"
                      }`}
                    >
                      Detection Results
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Disease:</strong> {detectionResult.disease}
                      </p>
                      <p>
                        <strong>Confidence:</strong> {detectionResult.confidence}%
                      </p>
                      <p>
                        <strong>Severity:</strong> <span className="capitalize">{detectionResult.severity}</span>
                      </p>
                      <p>
                        <strong>Treatment:</strong> {detectionResult.treatment}
                      </p>
                      {detectionResult.preventionTips && detectionResult.preventionTips.length > 0 && (
                        <div>
                          <strong>Prevention Tips:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {detectionResult.preventionTips.map((tip: string, idx: number) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
