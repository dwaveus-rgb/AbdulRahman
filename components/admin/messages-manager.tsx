"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { markMessageAsRead, deleteMessage } from "@/app/actions/admin"
import { Mail, Trash2, X, Check, ExternalLink, Inbox } from "lucide-react"
import type { ContactMessage } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface MessagesManagerProps {
  initialMessages: ContactMessage[]
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isPending, startTransition] = useTransition()

  const unreadCount = messages.filter(m => !m.is_read).length

  async function handleMarkAsRead(id: string) {
    startTransition(async () => {
      const result = await markMessageAsRead(id)
      if (result.success) {
        setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m))
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, is_read: true })
        }
        router.refresh()
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return
    
    startTransition(async () => {
      const result = await deleteMessage(id)
      if (result.success) {
        setMessages(messages.filter(m => m.id !== id))
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
        router.refresh()
      }
    })
  }

  function openMessage(message: ContactMessage) {
    setSelectedMessage(message)
    if (!message.is_read) {
      handleMarkAsRead(message.id)
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">
          {messages.length} total messages
        </span>
        {unreadCount > 0 && (
          <span className="px-2 py-1 text-sm bg-primary/20 text-primary rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Inbox className="mx-auto text-muted-foreground/50 mb-4" size={48} />
          <p className="text-muted-foreground">No messages yet</p>
        </GlassCard>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => openMessage(message)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? "bg-primary/10 border border-primary/40"
                    : "bg-glass border border-glass-border hover:border-primary/20"
                } ${!message.is_read ? "border-l-2 border-l-primary" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium truncate">{message.name}</span>
                  {!message.is_read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {message.subject || message.message.slice(0, 50)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(message.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <GlassCard className="p-6 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{selectedMessage.name}</h2>
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {selectedMessage.email}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    {!selectedMessage.is_read && (
                      <NeonButton
                        size="sm"
                        variant="secondary"
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        disabled={isPending}
                      >
                        <Check size={16} />
                        Mark Read
                      </NeonButton>
                    )}
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      disabled={isPending}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {selectedMessage.subject && (
                  <p className="text-lg font-medium mb-4">{selectedMessage.subject}</p>
                )}

                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-glass-border">
                  <p className="text-sm text-muted-foreground">
                    Received on {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="mt-6">
                  <NeonButton onClick={() => window.location.href = `mailto:${selectedMessage.email}`}>
                    <Mail size={18} />
                    Reply via Email
                  </NeonButton>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-12 h-full flex items-center justify-center">
                <div className="text-center">
                  <Mail className="mx-auto text-muted-foreground/50 mb-4" size={48} />
                  <p className="text-muted-foreground">Select a message to view</p>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </>
  )
}
