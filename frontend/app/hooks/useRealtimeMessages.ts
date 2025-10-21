import { useEffect, useState, useCallback, useRef } from 'react'

interface Message {
  id: string
  channelId: string
  userId: string | null
  userName: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
  } | null
}

export function useRealtimeMessages(channelId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const loadInitialMessages = useCallback(async () => {
    if (!channelId) return

    try {
      const response = await fetch(`/api/messages?channelId=${channelId}&limit=100`)
      const data = await response.json()
      setMessages(data)
    } catch (err) {
      console.error('Error loading messages:', err)
      setError('Failed to load messages')
    }
  }, [channelId])

  useEffect(() => {
    if (!channelId) return

    loadInitialMessages()

    const eventSource = new EventSource(`/api/messages/stream?channelId=${channelId}`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'message') {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === data.data.id)
            if (exists) return prev
            return [...prev, data.data]
          })
        } else if (data.type === 'connected') {
          console.log('Connected to channel:', data.channelId)
        } else if (data.type === 'heartbeat') {
        }
      } catch (err) {
        console.error('Error parsing message:', err)
      }
    }

    eventSource.onerror = () => {
      setConnected(false)
      setError('Connection lost. Reconnecting...')
      eventSource.close()
      
      setTimeout(() => {
        const newEventSource = new EventSource(`/api/messages/stream?channelId=${channelId}`)
        eventSourceRef.current = newEventSource
      }, 3000)
    }

    return () => {
      eventSource.close()
    }
  }, [channelId, loadInitialMessages])

  const sendMessage = useCallback(
    async (content: string, userName: string, userId?: string) => {
      if (!channelId || !content.trim()) return

      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId,
            userId,
            userName,
            content: content.trim(),
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }
      } catch (err) {
        console.error('Error sending message:', err)
        setError('Failed to send message')
      }
    },
    [channelId]
  )

  return {
    messages,
    connected,
    error,
    sendMessage,
    refreshMessages: loadInitialMessages,
  }
}
