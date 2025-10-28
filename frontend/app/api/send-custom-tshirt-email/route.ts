import { NextRequest, NextResponse } from 'next/server'
import { ServerClient } from 'postmark'

// Force this route to be dynamic (not pre-rendered during build)
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, size, quantity, description, imageUrl } = body

    // Validate required fields
    if (!name || !email || !phone || !size || !quantity) {
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
      Subject: `New Custom T-Shirt Order from ${name}`,
      HtmlBody: `
        <h2>New Custom T-Shirt Order Request</h2>
        <p><strong>Customer Information:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>

        <p><strong>Order Details:</strong></p>
        <ul>
          <li><strong>T-Shirt Size:</strong> ${size}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          ${description ? `<li><strong>Additional Notes:</strong> ${description}</li>` : ''}
        </ul>

        ${imageUrl ? `<p><strong>Design Image:</strong> <a href="${imageUrl}">${imageUrl}</a></p>` : '<p><em>No design image uploaded</em></p>'}

        <hr>
        <p><small>This email was sent from the Shenna's Studio custom t-shirt order form.</small></p>
      `,
      TextBody: `
New Custom T-Shirt Order Request

Customer Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Order Details:
- T-Shirt Size: ${size}
- Quantity: ${quantity}
${description ? `- Additional Notes: ${description}` : ''}

${imageUrl ? `Design Image: ${imageUrl}` : 'No design image uploaded'}

---
This email was sent from the Shenna's Studio custom t-shirt order form.
      `,
      MessageStream: 'outbound',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Custom t-shirt order email sent successfully',
        messageId: response.MessageID,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending custom t-shirt email:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
