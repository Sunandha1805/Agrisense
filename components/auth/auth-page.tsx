"use client"

import { useState } from "react"
import { SignupForm } from "./signup-form"
import { LoginForm } from "./login-form"

interface AuthPageProps {
  onAuthSuccess: (data: any) => void
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignup, setIsSignup] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSignup ? (
          <SignupForm onSuccess={onAuthSuccess} onToggle={() => setIsSignup(false)} />
        ) : (
          <LoginForm onSuccess={onAuthSuccess} onToggle={() => setIsSignup(true)} />
        )}
      </div>
    </div>
  )
}
