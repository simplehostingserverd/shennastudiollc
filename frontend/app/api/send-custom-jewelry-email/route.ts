import { NextRequest, NextResponse } from 'next/server'
import { ServerClient } from 'postmark'

// Initialize Postmark client
const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, itemType, description, budget, imageUrl } = body

    // Validate required fields
    if (!name || !email || !phone || !itemType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email using Postmark
    const response = await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL || 'shenna@shennastudio.com',
      To: 'shenna@shennastudio.com',
      Subject: `New Custom Jewelry Design from ${name}`,
      HtmlBody: `
        <h2>New Custom Jewelry Design Request</h2>
        <p><strong>Customer Information:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>

        <p><strong>Design Details:</strong></p>
        <ul>
          <li><strong>Item Type:</strong> ${itemType}</li>
          ${budget ? `<li><strong>Budget:</strong> ${budget}</li>` : ''}
          ${description ? `<li><strong>Design Description:</strong> ${description}</li>` : ''}
        </ul>

        ${imageUrl ? `<p><strong>Design Image:</strong> <a href="${imageUrl}">${imageUrl}</a></p>` : '<p><em>No design image uploaded</em></p>'}

        <hr>
        <p><small>This email was sent from the Shenna's Studio custom jewelry design form.</small></p>
      `,
      TextBody: `
New Custom Jewelry Design Request

Customer Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Design Details:
- Item Type: ${itemType}
${budget ? `- Budget: ${budget}` : ''}
${description ? `- Design Description: ${description}` : ''}

${imageUrl ? `Design Image: ${imageUrl}` : 'No design image uploaded'}

---
This email was sent from the Shenna's Studio custom jewelry design form.
      `,
      MessageStream: 'outbound',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Custom jewelry order email sent successfully',
        messageId: response.MessageID,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending custom jewelry email:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
