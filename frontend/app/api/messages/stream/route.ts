import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const channelId = searchParams.get('channelId')

  if (!channelId) {
    return new Response('Channel ID required', { status: 400 })
  }

  const encoder = new TextEncoder()
  let lastMessageTime = new Date()
  let intervalId: NodeJS.Timeout | null = null

  const stream = new ReadableStream({
    async start(controller) {
      const sendMessage = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      sendMessage({ type: 'connected', channelId })

      const pollMessages = async () => {
        try {
          const newMessages = await prisma.message.findMany({
            where: {
              channelId,
              createdAt: {
                gt: lastMessageTime,
              },
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          })

          if (newMessages.length > 0) {
            newMessages.forEach((message) => {
              sendMessage({ type: 'message', data: message })
            })
            lastMessageTime = newMessages[newMessages.length - 1].createdAt
          }

          sendMessage({ type: 'heartbeat', timestamp: new Date().toISOString() })
        } catch (error) {
          console.error('Error polling messages:', error)
        }
      }

      await pollMessages()

      intervalId = setInterval(pollMessages, 2000)

      request.signal.addEventListener('abort', () => {
        if (intervalId) clearInterval(intervalId)
        controller.close()
      })
    },
    cancel() {
      if (intervalId) clearInterval(intervalId)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
