import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with a default value to prevent build errors
const resend = new Resend(process.env.RESEND_API_KEY || '')

// Rate limiting store (in production, use Redis or a database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Spam keywords to check
const SPAM_KEYWORDS = [
  'viagra',
  'cialis',
  'casino',
  'lottery',
  'bitcoin',
  'crypto investment',
  'make money fast',
  'mlm',
  'pyramid scheme',
  'click here now',
  'act now',
  'limited time offer',
  'congratulations you won',
  'nigerian prince',
  'inheritance',
]

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  recaptchaToken: string
}

// Helper function to check for spam content
function containsSpam(text: string): boolean {
  const lowerText = text.toLowerCase()
  return SPAM_KEYWORDS.some((keyword) => lowerText.includes(keyword))
}

// Helper function to check for suspicious patterns
function hasSuspiciousPatterns(data: ContactFormData): boolean {
  // Check for excessive URLs
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const urls = data.message.match(urlPattern) || []
  if (urls.length > 3) return true

  // Check for excessive capitalization
  const capsRatio =
    (data.message.match(/[A-Z]/g) || []).length / data.message.length
  if (capsRatio > 0.5 && data.message.length > 20) return true

  // Check for repeated characters
  if (/(.)\1{10,}/.test(data.message)) return true

  // Check for suspicious email patterns
  const suspiciousEmailDomains = [
    'tempmail',
    'guerrillamail',
    'mailinator',
    '10minutemail',
    'throwaway',
  ]
  if (
    suspiciousEmailDomains.some((domain) =>
      data.email.toLowerCase().includes(domain)
    )
  ) {
    return true
  }

  return false
}

// Rate limiting function
function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(identifier)

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (5 requests per hour)
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    })
    return true
  }

  if (limit.count >= 5) {
    return false
  }

  limit.count++
  return true
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    )

    const data = await response.json()
    return data.success && data.score >= 0.5 // Require score of at least 0.5
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error)
    return false
  }
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 5000) // Limit length
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
        },
        { status: 429 }
      )
    }

    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        {
          error: 'All fields are required.',
        },
        { status: 400 }
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(body.email)) {
      return NextResponse.json(
        {
          error: 'Invalid email address.',
        },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA token
    if (!body.recaptchaToken) {
      return NextResponse.json(
        {
          error: 'reCAPTCHA verification required.',
        },
        { status: 400 }
      )
    }

    const isValidRecaptcha = await verifyRecaptcha(body.recaptchaToken)
    if (!isValidRecaptcha) {
      return NextResponse.json(
        {
          error: 'reCAPTCHA verification failed. Please try again.',
        },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      subject: sanitizeInput(body.subject),
      message: sanitizeInput(body.message),
    }

    // Check for spam content
    if (
      containsSpam(sanitizedData.message) ||
      containsSpam(sanitizedData.subject)
    ) {
      console.warn('Spam detected from:', clientIp, sanitizedData.email)
      return NextResponse.json(
        {
          error: 'Your message was flagged as spam. Please contact us directly.',
        },
        { status: 400 }
      )
    }

    // Check for suspicious patterns
    if (
      hasSuspiciousPatterns({
        ...sanitizedData,
        recaptchaToken: body.recaptchaToken,
      })
    ) {
      console.warn('Suspicious patterns detected from:', clientIp)
      return NextResponse.json(
        {
          error:
            'Your message contains suspicious content. Please contact us directly.',
        },
        { status: 400 }
      )
    }

    // Validate message length
    if (sanitizedData.message.length < 10) {
      return NextResponse.json(
        {
          error: 'Message is too short. Please provide more details.',
        },
        { status: 400 }
      )
    }

    if (sanitizedData.message.length > 5000) {
      return NextResponse.json(
        {
          error: 'Message is too long. Please keep it under 5000 characters.',
        },
        { status: 400 }
      )
    }

    // Send email via Resend
    const emailData = await resend.emails.send({
      from: 'Shenna\'s Studio Contact Form <contact@shennastudio.com>',
      to: 'shenna@shennastudio.com',
      replyTo: sanitizedData.email,
      subject: `Contact Form: ${sanitizedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1f2937; margin-top: 0;">Contact Information</h2>
              <p style="margin: 10px 0;"><strong style="color: #4b5563;">Name:</strong> <span style="color: #1f2937;">${sanitizedData.name}</span></p>
              <p style="margin: 10px 0;"><strong style="color: #4b5563;">Email:</strong> <span style="color: #1f2937;">${sanitizedData.email}</span></p>
              <p style="margin: 10px 0;"><strong style="color: #4b5563;">Subject:</strong> <span style="color: #1f2937;">${sanitizedData.subject}</span></p>
            </div>

            <div style="background: white; padding: 25px; border-radius: 8px;">
              <h2 style="color: #1f2937; margin-top: 0;">Message</h2>
              <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${sanitizedData.message}</p>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #e0e7ff; border-radius: 8px;">
              <p style="color: #4338ca; margin: 0; font-size: 14px;">
                <strong>Note:</strong> This message passed all spam filters and reCAPTCHA verification.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>Sent from Shenna's Studio Contact Form</p>
            <p>IP Address: ${clientIp}</p>
          </div>
        </div>
      `,
    })

    console.log('Email sent successfully:', emailData.id)

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        error: 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    )
  }
}
