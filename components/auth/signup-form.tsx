"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, MapPin, Leaf } from "lucide-react"

interface SignupFormProps {
  onSuccess: (data: any) => void
  onToggle: () => void
}

export function SignupForm({ onSuccess, onToggle }: SignupFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    state: "",
    city: "",
    cropType: "",
    farmArea: "",
    season: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [locationDetected, setLocationDetected] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAutoDetect = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            try {
              // Use reverse geocoding to get city and state from coordinates
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              )
              const data = await response.json()

              // Extract city and state from the response
              const city = data.address?.city || data.address?.town || data.address?.village || ""
              const state = data.address?.state || ""

              if (city && state) {
                setFormData((prev) => ({
                  ...prev,
                  state: state,
                  city: city,
                }))
                setLocationDetected(true)
              } else {
                // Fallback to IP-based geolocation if reverse geocoding fails
                fallbackToIPGeolocation()
              }
            } catch (error) {
              console.error("Reverse geocoding failed:", error)
              fallbackToIPGeolocation()
            }
          },
          (error) => {
            console.error("Geolocation error:", error)
            // Fallback to IP-based geolocation if browser geolocation fails
            fallbackToIPGeolocation()
          },
        )
      } else {
        // Fallback to IP-based geolocation if browser doesn't support geolocation
        fallbackToIPGeolocation()
      }
    } catch (error) {
      console.error("Failed to detect location:", error)
    }
  }

  const fallbackToIPGeolocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/")
      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        state: data.region || "",
        city: data.city || "",
      }))
      setLocationDetected(true)
    } catch (error) {
      console.error("IP geolocation failed:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.city) newErrors.city = "City is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const locationData = {
        state: formData.state,
        city: formData.city,
      }
      localStorage.setItem("userLocation", JSON.stringify(locationData))

      onSuccess({
        fullName: formData.fullName,
        email: formData.email,
        state: formData.state,
        city: formData.city,
        cropType: formData.cropType,
        farmArea: formData.farmArea,
        season: formData.season,
      })
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AgriSense</h1>
        <p className="text-gray-600">Start your smart farming journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-lg p-8">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
          <Input
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            className={`${errors.fullName ? "border-red-500" : ""} rounded-lg`}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
          <Input
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`${errors.email ? "border-red-500" : ""} rounded-lg`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Password</label>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              className={`${errors.password ? "border-red-500" : ""} rounded-lg`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm Password</label>
          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${errors.confirmPassword ? "border-red-500" : ""} rounded-lg`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Location Information */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-teal-500" /> Location Information
            </label>
            <Button
              type="button"
              onClick={handleAutoDetect}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Auto-detect
            </Button>
          </div>

          {locationDetected && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700">
              ✓ Location Detected
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">State</label>
              <Input
                name="state"
                placeholder="Karnataka"
                value={formData.state}
                onChange={handleChange}
                className={`${errors.state ? "border-red-500" : ""} rounded-lg`}
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">City</label>
              <Input
                name="city"
                placeholder="Bengaluru"
                value={formData.city}
                onChange={handleChange}
                className={`${errors.city ? "border-red-500" : ""} rounded-lg`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>
        </div>

        {/* Optional Farm Details */}
        <div className="border-t pt-6">
          <label className="text-sm font-semibold text-gray-900 mb-4 block">Optional Farm Details</label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="cropType"
              placeholder="Crop (e.g., Wheat)"
              value={formData.cropType}
              onChange={handleChange}
              className="rounded-lg"
            />
            <Input
              name="season"
              placeholder="Season (e.g., Rabi)"
              value={formData.season}
              onChange={handleChange}
              className="rounded-lg"
            />
            <Input
              name="farmArea"
              placeholder="Area (Hectare)"
              value={formData.farmArea}
              onChange={handleChange}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-base"
        >
          Create Account
        </Button>

        {/* Toggle to Login */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button type="button" onClick={onToggle} className="text-blue-600 hover:underline font-semibold">
            Sign in here
          </button>
        </p>
      </form>
    </div>
  )
}
