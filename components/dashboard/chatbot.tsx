"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send } from "lucide-react"

interface ChatBotProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatBot({ isOpen, onToggle }: ChatBotProps) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "bot", content: "Hello! I'm AgriSense Assistant. How can I help you with your farming today?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      // Simulate bot response - in production, connect to an AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.reply || "I'm here to help with your farming questions!" },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "I'm having trouble responding. Please try again later." },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
        <h3 className="font-semibold">AgriSense Assistant</h3>
        <button onClick={onToggle} className="hover:bg-white hover:bg-opacity-20 p-1 rounded">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                msg.role === "user" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1"
          disabled={loading}
        />
        <Button
          type="submit"
          size="sm"
          className="bg-teal-600 hover:bg-teal-700 text-white"
          disabled={loading || !input.trim()}
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  )
}
