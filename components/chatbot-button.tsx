"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! How can I help you with your shopping today?" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory")
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error("Failed to parse chat history:", error)
      }
    }
  }, [])

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages))
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Get the last 5 messages for context
      const recentMessages = messages
        .slice(-5)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: recentMessages,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Hello! How can I help you with your shopping today?" }])
    localStorage.removeItem("chatHistory")
  }

  return (
    <>
      <Button className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0" onClick={() => setIsOpen(true)}>
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 md:w-96 shadow-lg z-50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">AI Shopping Assistant</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearChat}>
                  Clear
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-80 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-max max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-muted w-max max-w-[80%] rounded-lg px-3 py-2 text-sm">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" size="sm" disabled={isLoading}>
                Send
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
