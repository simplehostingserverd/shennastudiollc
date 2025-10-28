import { NextRequest, NextResponse } from 'next/server'
import { ServerClient } from 'postmark'

// Force this route to be dynamic (not pre-rendered during build)
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Postmark client (lazy initialization to avoid build-time errors)
    const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY || '')

    // Send email using Postmark
    const response = await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL || 'shenna@shennastudio.com',
      To: 'shenna@shennastudio.com',
      ReplyTo: email,
      Subject: `Contact Form: ${subject}`,
      HtmlBody: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <hr>

        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>

        <hr>
        <p><small>This email was sent from the Shenna's Studio contact form.</small></p>
      `,
      TextBody: `
New Contact Form Submission

From: ${name} (${email})
Subject: ${subject}

---

Message:
${message}

---
This email was sent from the Shenna's Studio contact form.
      `,
      MessageStream: 'outbound',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form email sent successfully',
        messageId: response.MessageID,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending contact email:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
