import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting store (in production, use Redis or a database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Rate limiting function
function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(identifier)

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (3 signups per hour)
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    })
    return true
  }

  if (limit.count >= 3) {
    return false
  }

  limit.count++
  return true
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

    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          error: 'Email address is required.',
        },
        { status: 400 }
      )
    }

    const sanitizedEmail = email.trim().toLowerCase()

    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return NextResponse.json(
        {
          error: 'Invalid email address.',
        },
        { status: 400 }
      )
    }

    // Check for suspicious email patterns
    const suspiciousEmailDomains = [
      'tempmail',
      'guerrillamail',
      'mailinator',
      '10minutemail',
      'throwaway',
      'trashmail',
      'fakeinbox',
    ]

    if (
      suspiciousEmailDomains.some((domain) =>
        sanitizedEmail.toLowerCase().includes(domain)
      )
    ) {
      return NextResponse.json(
        {
          error: 'Please use a valid email address.',
        },
        { status: 400 }
      )
    }

    // Send welcome email to subscriber
    const welcomeEmail = await resend.emails.send({
      from: 'Shenna\'s Studio <newsletter@shennastudio.com>',
      to: sanitizedEmail,
      subject: 'Welcome to Shenna\'s Studio Newsletter! 🌊',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Shenna's Studio Newsletter</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f9ff;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f9ff;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);">

                  <!-- Header with Gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%); padding: 50px 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                        Welcome to Shenna's Studio! 🌊
                      </h1>
                      <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">
                        Where Ocean Magic Meets Artistry
                      </p>
                    </td>
                  </tr>

                  <!-- Content Section -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="color: #0c4a6e; font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">
                        Thank you for joining our ocean-loving community! 🐚
                      </p>

                      <p style="color: #075985; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                        We're thrilled to have you as part of our journey to bring the beauty of the ocean into everyday life. As a newsletter subscriber, you'll be the first to know about:
                      </p>

                      <!-- Benefits List -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding: 12px 0;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="30" valign="top" style="font-size: 20px;">🎨</td>
                                <td style="color: #0c4a6e; font-size: 15px; line-height: 1.5;">
                                  <strong>New Product Launches</strong> - Be the first to discover our latest ocean-inspired creations
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="30" valign="top" style="font-size: 20px;">✨</td>
                                <td style="color: #0c4a6e; font-size: 15px; line-height: 1.5;">
                                  <strong>Exclusive Discounts</strong> - Special offers just for our newsletter family
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="30" valign="top" style="font-size: 20px;">🌊</td>
                                <td style="color: #0c4a6e; font-size: 15px; line-height: 1.5;">
                                  <strong>Ocean Conservation Updates</strong> - Learn how your purchases help protect our oceans
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="30" valign="top" style="font-size: 20px;">🎁</td>
                                <td style="color: #0c4a6e; font-size: 15px; line-height: 1.5;">
                                  <strong>Behind-the-Scenes Stories</strong> - Get to know the artists and process behind each piece
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 35px 0 25px 0;">
                        <tr>
                          <td align="center">
                            <a href="https://www.shennastudio.com/products" style="display: inline-block; background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);">
                              Explore Our Collection
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Conservation Message -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%); padding: 30px 40px; text-align: center;">
                      <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                        <strong style="font-size: 18px;">🌊 Ocean Conservation Commitment 🌊</strong>
                      </p>
                      <p style="color: rgba(255, 255, 255, 0.95); font-size: 15px; line-height: 1.6; margin: 0;">
                        Remember, 10% of every purchase goes directly to marine conservation efforts. Together, we're making waves of positive change for our oceans!
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; text-align: center; background-color: #f0f9ff;">
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 15px 0;">
                        <strong>Shenna's Studio</strong><br>
                        2436 Pablo Kisel Boulevard<br>
                        Brownsville, Texas 78526
                      </p>
                      <p style="color: #64748b; font-size: 13px; margin: 0 0 10px 0;">
                        Questions? Email us at <a href="mailto:shenna@shennastudio.com" style="color: #0EA5E9; text-decoration: none;">shenna@shennastudio.com</a>
                      </p>
                      <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0 0;">
                        You're receiving this email because you signed up for our newsletter at shennastudio.com
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    // Send notification to admin
    await resend.emails.send({
      from: 'Shenna\'s Studio Newsletter <newsletter@shennastudio.com>',
      to: 'shenna@shennastudio.com',
      subject: 'New Newsletter Subscriber! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Newsletter Subscriber! 🎉</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px;">
              <h2 style="color: #1f2937; margin-top: 0;">Subscriber Details</h2>
              <p style="margin: 10px 0;"><strong style="color: #4b5563;">Email:</strong> <span style="color: #1f2937;">${sanitizedEmail}</span></p>
              <p style="margin: 10px 0;"><strong style="color: #4b5563;">Signed up at:</strong> <span style="color: #1f2937;">${new Date().toLocaleString()}</span></p>
              <p style="margin: 10px 0;"><strong style="color: #4b5563;">IP Address:</strong> <span style="color: #1f2937;">${clientIp}</span></p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>Sent from Shenna's Studio Newsletter System</p>
          </div>
        </div>
      `,
    })

    console.log('Newsletter signup successful:', sanitizedEmail)

    return NextResponse.json(
      {
        success: true,
        message:
          'Thank you for subscribing! Check your email for a welcome message.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process subscription. Please try again later.',
      },
      { status: 500 }
    )
  }
}
