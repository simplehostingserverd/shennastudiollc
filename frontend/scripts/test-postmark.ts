import { ServerClient } from 'postmark'
import * as dotenv from 'dotenv'

dotenv.config()

async function testPostmark() {
  console.log('🧪 Testing Postmark email integration...\n')

  const apiKey = process.env.POSTMARK_API_KEY
  const fromEmail = process.env.POSTMARK_FROM_EMAIL

  if (!apiKey) {
    console.error('❌ POSTMARK_API_KEY not found in environment')
    process.exit(1)
  }

  if (!fromEmail) {
    console.error('❌ POSTMARK_FROM_EMAIL not found in environment')
    process.exit(1)
  }

  console.log(`✅ API Key found: ${apiKey.substring(0, 8)}...`)
  console.log(`✅ From Email: ${fromEmail}\n`)

  try {
    const client = new ServerClient(apiKey)

    console.log('📧 Sending test email...')

    const response = await client.sendEmail({
      From: fromEmail,
      To: fromEmail,
      Subject: 'Test Email from Shenna\'s Studio',
      HtmlBody: '<h1>Test Email</h1><p>If you receive this, Postmark is working correctly!</p>',
      TextBody: 'Test Email - If you receive this, Postmark is working correctly!',
      MessageStream: 'outbound',
    })

    console.log('\n✅ Email sent successfully!')
    console.log(`Message ID: ${response.MessageID}`)
    console.log(`Submitted at: ${response.SubmittedAt}`)
    console.log(`To: ${response.To}`)

  } catch (error) {
    console.error('\n❌ Failed to send email:')
    console.error(error)
    process.exit(1)
  }
}

testPostmark()
