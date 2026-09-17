"use client"

import { useState, useRef, useEffect } from "react"
import { sendChatMessage, getChatHistory } from "@/actions/chat"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Avatar } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"
import { Send, Loader2, Sparkles, Trash2, Copy, MessageSquare } from "lucide-react"

interface ChatMessage {
  id: string
  role: "USER" | "ASSISTANT" | "SYSTEM"
  content: string
  createdAt: string
}

interface ChatViewProps {
  saveId?: string
}

export function ChatView({ saveId }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadHistory()
  }, [saveId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadHistory = async () => {
    try {
      const history = await getChatHistory()
      setMessages(history)
    } catch (error) {
      console.error("Failed to load chat history:", error)
    } finally {
      setIsInitialized(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    const tempId = `temp-${Date.now()}`
    const newUserMessage: ChatMessage = {
      id: tempId,
      role: "USER",
      content: userMessage,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newUserMessage])

    try {
      const result = await sendChatMessage(userMessage)
      if (result.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? result.message : m))
        )
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
        alert(result.error || "Mesaj gönderilemedi")
      }
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      alert("Bir hata oluştu")
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const clearHistory = async () => {
    if (!confirm("Sohbet geçmişini temizlemek istediğinizden emin misiniz?")) return
    try {
      await fetch("/api/chat/clear", { method: "POST" })
      setMessages([])
    } catch (error) {
      alert("Geçmiş temizlenemedi")
    }
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Kütüphane Asistanı</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {saveId ? "Bu kayıt hakkında soru sorun" : "Tüm kütüphanenizle sohbet edin"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearHistory} className="text-gray-400 hover:text-red-500">
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-12 w-12 mb-4 opacity-30" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Henüz sohbet yok</h4>
            <p className="text-sm">Kütüphaneniz hakkında soru sorun, özet isteyin veya bağlantılar kurun</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {[
                "Geçen ay kaydettiğim İtalya mekanları?",
                "Tariflerime göre alışveriş listesi oluştur",
                "İzlediğim kod eğitimlerinin özetini ver",
                "Kaydettiğim indirim kodları nelerdi?",
              ].map((suggestion, i) => (
                <Button key={i} variant="outline" size="sm" onClick={() => { setInput(suggestion); handleSubmit(new Event("submit")) }}>
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "USER" && "justify-end"
              )}
            >
              <Avatar
                size="sm"
                name={message.role === "USER" ? "Siz" : "AI"}
                src={message.role === "ASSISTANT" ? undefined : undefined}
                className={cn(message.role === "USER" && "order-2")}
              >
                {message.role === "ASSISTANT" && (
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                )}
              </Avatar>
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-3",
                  message.role === "USER"
                    ? "bg-primary-600 text-white rounded-tr-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm"
                )}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="flex items-center justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(message.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => copyMessage(message.content)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={saveId ? "Bu kayıt hakkında sorun..." : "Kütüphanenizle sohbet edin..."}
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y min-h-[48px] max-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="lg"
            disabled={!input.trim() || isLoading}
            className="h-12 rounded-xl"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
          Enter: Gönder • Shift+Enter: Yeni satır
        </p>
      </div>
    </div>
  )
}