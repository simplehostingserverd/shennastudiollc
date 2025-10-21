'use client'

import { useState, useEffect, useRef } from 'react'
import { useRealtimeMessages } from '../hooks/useRealtimeMessages'

interface Channel {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  _count: {
    messages: number
  }
}

export default function CommunityPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [userName, setUserName] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [showNamePrompt, setShowNamePrompt] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, connected, error, sendMessage } = useRealtimeMessages(
    selectedChannel?.id || null
  )

  useEffect(() => {
    fetchChannels()
    
    const savedName = localStorage.getItem('chat-username')
    if (savedName) {
      setUserName(savedName)
      setShowNamePrompt(false)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels')
      const data = await response.json()
      setChannels(data)
      if (data.length > 0 && !selectedChannel) {
        setSelectedChannel(data[0])
      }
    } catch (error) {
      console.error('Error fetching channels:', error)
    }
  }

  const handleSetName = (name: string) => {
    if (name.trim()) {
      setUserName(name.trim())
      localStorage.setItem('chat-username', name.trim())
      setShowNamePrompt(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !userName) return

    await sendMessage(messageInput, userName)
    setMessageInput('')
  }

  if (showNamePrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-500 to-seafoam-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💬</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to the Community!
            </h1>
            <p className="text-gray-600">
              Enter your name to start chatting about bead bracelets and ocean conservation
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.elements.namedItem('name') as HTMLInputElement
              handleSetName(input.value)
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent mb-4"
              autoFocus
              required
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors font-semibold"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Shenna's Community</h1>
          <p className="text-xs text-gray-400 mt-1">Bead Bracelets & Ocean Talk</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">
              Channels
            </div>
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`w-full text-left px-2 py-2 rounded mb-1 transition-colors ${
                  selectedChannel?.id === channel.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-2">{channel.icon || '💬'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{channel.name}</div>
                    {channel.description && (
                      <div className="text-xs text-gray-400 truncate">
                        {channel.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-ocean-500 rounded-full flex items-center justify-center font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2 flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{userName}</div>
              <div className="flex items-center text-xs text-gray-400">
                <div className={`w-2 h-2 rounded-full mr-1 ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                {connected ? 'Online' : 'Offline'}
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('chat-username')
                setShowNamePrompt(true)
              }}
              className="text-gray-400 hover:text-white text-xs"
              title="Change name"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{selectedChannel.icon || '💬'}</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedChannel.name}
                  </h2>
                  {selectedChannel.description && (
                    <p className="text-sm text-gray-600">{selectedChannel.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to #{selectedChannel.name}!
                  </h3>
                  <p className="text-gray-600">
                    This is the beginning of the conversation. Say hello!
                  </p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isNewUser = index === 0 || messages[index - 1].userName !== message.userName
                  const showTimestamp = isNewUser || 
                    (index > 0 && 
                      new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 300000)

                  return (
                    <div key={message.id} className={isNewUser ? 'mt-4' : 'mt-1'}>
                      {isNewUser && (
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gradient-to-br from-ocean-400 to-seafoam-400 rounded-full flex items-center justify-center font-bold text-white mr-3 flex-shrink-0">
                            {message.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline">
                              <span className="font-semibold text-gray-900 mr-2">
                                {message.userName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="text-gray-800 break-words">{message.content}</div>
                          </div>
                        </div>
                      )}
                      {!isNewUser && (
                        <div className="flex">
                          <div className="w-10 mr-3 flex-shrink-0" />
                          <div className="text-gray-800 break-words flex-1">
                            {showTimestamp && (
                              <span className="text-xs text-gray-500 mr-2">
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                            {message.content}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage}>
                <div className="flex items-end gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Message #${selectedChannel.name}`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none"
                    disabled={!connected}
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || !connected}
                    className="px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">👈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a channel to start chatting
              </h3>
              <p className="text-gray-600">Choose a channel from the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
