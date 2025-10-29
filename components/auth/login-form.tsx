"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Leaf } from "lucide-react"

interface LoginFormProps {
  onSuccess: (data: any) => void
  onToggle: () => void
}

export function LoginForm({ onSuccess, onToggle }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!email) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length === 0) {
      onSuccess({
        email,
        fullName: "Robi",
        state: "Karnataka",
        city: "Bengaluru",
        cropType: "Rice",
        farmArea: "150",
      })
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Sign in to your farming dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-lg p-8">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
            }}
            className={`${errors.email ? "border-red-500" : ""} rounded-lg`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
              }}
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

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-base"
        >
          Sign In
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button type="button" onClick={onToggle} className="text-blue-600 hover:underline font-semibold">
            Sign up here
          </button>
        </p>

        <p className="text-center text-xs text-gray-500">
          <a href="#" className="hover:underline">
            Forgot your password?
          </a>
        </p>
      </form>
    </div>
  )
}
