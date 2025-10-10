import { Resend } from 'resend'

// Initialize Resend client
export const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured')
    return null
  }

  return new Resend(apiKey)
}

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || 'Shenna\'s Studio <noreply@shennastudio.com>',
  adminEmail: process.env.ADMIN_EMAIL || 'shenna@shennastudio.com',
  replyTo: process.env.RESEND_REPLY_TO_EMAIL || 'shenna@shennastudio.com',
}

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    title: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  orderDate: string
}

// Send customer receipt email
export async function sendCustomerReceipt(data: OrderEmailData) {
  const resend = getResendClient()

  if (!resend) {
    console.error('Resend client not initialized - skipping email')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.customerEmail,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: generateCustomerReceiptHTML(data),
    })

    if (error) {
      console.error('Failed to send customer receipt:', error)
      return { success: false, error }
    }

    console.log('Customer receipt sent successfully:', emailData)
    return { success: true, data: emailData }
  } catch (error) {
    console.error('Error sending customer receipt:', error)
    return { success: false, error }
  }
}

// Send admin notification email
export async function sendAdminNotification(data: OrderEmailData) {
  const resend = getResendClient()

  if (!resend) {
    console.error('Resend client not initialized - skipping email')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.adminEmail,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: `New Order Received - ${data.orderNumber}`,
      html: generateAdminNotificationHTML(data),
    })

    if (error) {
      console.error('Failed to send admin notification:', error)
      return { success: false, error }
    }

    console.log('Admin notification sent successfully:', emailData)
    return { success: true, data: emailData }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error }
  }
}

// Generate customer receipt HTML
function generateCustomerReceiptHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.title}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        $${(item.price / 100).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f9ff;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🌊 Shenna's Studio</h1>
      <p style="color: #e0f2fe; margin: 10px 0 0 0;">Thank you for your order!</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 20px;">
      <h2 style="color: #0c4a6e; margin: 0 0 20px 0;">Order Confirmation</h2>

      <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
        Hi ${data.customerName},
      </p>

      <p style="color: #475569; line-height: 1.6; margin: 0 0 30px 0;">
        We've received your order and are getting it ready. Thank you for supporting ocean conservation!
        Remember, 10% of your purchase goes directly to marine protection efforts. 🐢
      </p>

      <!-- Order Details -->
      <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Order Number:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0c4a6e;">
              ${data.orderNumber}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Order Date:</td>
            <td style="padding: 8px 0; text-align: right; color: #0c4a6e;">
              ${data.orderDate}
            </td>
          </tr>
        </table>
      </div>

      <!-- Items Table -->
      <h3 style="color: #0c4a6e; margin: 0 0 15px 0;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 12px; text-align: left; color: #475569;">Item</th>
            <th style="padding: 12px; text-align: center; color: #475569;">Qty</th>
            <th style="padding: 12px; text-align: right; color: #475569;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Subtotal:</td>
            <td style="padding: 8px 0; text-align: right; color: #0c4a6e;">
              $${(data.subtotal / 100).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Shipping:</td>
            <td style="padding: 8px 0; text-align: right; color: #0c4a6e;">
              $${(data.shipping / 100).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Tax:</td>
            <td style="padding: 8px 0; text-align: right; color: #0c4a6e;">
              $${(data.tax / 100).toFixed(2)}
            </td>
          </tr>
          <tr style="border-top: 2px solid #cbd5e1;">
            <td style="padding: 12px 0; font-weight: bold; color: #0c4a6e; font-size: 18px;">
              Total:
            </td>
            <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #0891b2; font-size: 18px;">
              $${(data.total / 100).toFixed(2)}
            </td>
          </tr>
        </table>
      </div>

      <!-- Shipping Address -->
      <h3 style="color: #0c4a6e; margin: 0 0 15px 0;">Shipping Address</h3>
      <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <p style="margin: 0; color: #475569; line-height: 1.8;">
          ${data.shippingAddress.name}<br>
          ${data.shippingAddress.line1}<br>
          ${data.shippingAddress.line2 ? `${data.shippingAddress.line2}<br>` : ''}
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postal_code}<br>
          ${data.shippingAddress.country}
        </p>
      </div>

      <!-- Footer Message -->
      <p style="color: #64748b; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
        We'll send you another email when your order ships. If you have any questions,
        please don't hesitate to contact us at ${EMAIL_CONFIG.replyTo}.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #0c4a6e; padding: 30px 20px; text-align: center;">
      <p style="color: #e0f2fe; margin: 0 0 10px 0; font-size: 14px;">
        💙 Thank you for supporting ocean conservation!
      </p>
      <p style="color: #94a3b8; margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} Shenna's Studio. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// Generate admin notification HTML
function generateAdminNotificationHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb;">
    <!-- Header -->
    <div style="background-color: #0891b2; padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 New Order Received!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 30px 20px;">
      <h2 style="color: #1f2937; margin: 0 0 20px 0;">Order Details</h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Order Number:</td>
          <td style="padding: 8px 0; text-align: right; color: #1f2937;">${data.orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Order Date:</td>
          <td style="padding: 8px 0; text-align: right; color: #1f2937;">${data.orderDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Customer:</td>
          <td style="padding: 8px 0; text-align: right; color: #1f2937;">${data.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0; text-align: right; color: #1f2937;">${data.customerEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Total:</td>
          <td style="padding: 8px 0; text-align: right; color: #0891b2; font-size: 18px; font-weight: bold;">
            $${(data.total / 100).toFixed(2)}
          </td>
        </tr>
      </table>

      <h3 style="color: #1f2937; margin: 20px 0 10px 0;">Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
            <th style="padding: 8px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <h3 style="color: #1f2937; margin: 20px 0 10px 0;">Shipping Address</h3>
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px;">
        <p style="margin: 0; color: #374151; line-height: 1.6;">
          ${data.shippingAddress.name}<br>
          ${data.shippingAddress.line1}<br>
          ${data.shippingAddress.line2 ? `${data.shippingAddress.line2}<br>` : ''}
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postal_code}<br>
          ${data.shippingAddress.country}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f3f4f6; padding: 15px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0; font-size: 12px;">
        This is an automated notification from Shenna's Studio
      </p>
    </div>
  </div>
</body>
</html>
  `
}
