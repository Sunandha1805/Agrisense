"use client"

import { useState } from "react"
import { AuthPage } from "@/components/auth/auth-page"
import { Dashboard } from "@/components/dashboard/dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)

  const handleAuthSuccess = (data: any) => {
    setUserData(data)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserData(null)
  }

  return (
    <main>
      {!isAuthenticated ? (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      ) : (
        <Dashboard userData={userData} onLogout={handleLogout} />
      )}
    </main>
  )
}
