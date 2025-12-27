'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader } from 'lucide-react'
import { Button } from './Button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatBoxProps {
  contentId: string
  contentTitle?: string
}

export function ChatBox({ contentId, contentTitle }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          question: userMessage.content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_response`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800">
        <h3 className="font-bold">{contentTitle || 'Study Assistant'}</h3>
        <p className="text-xs text-slate-400">Ask questions about your material</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !error && (
          <div className="text-center text-slate-400 py-8">
            <p>Ask a question about your study material</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-slate-700 bg-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask a question..."
            className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            icon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
