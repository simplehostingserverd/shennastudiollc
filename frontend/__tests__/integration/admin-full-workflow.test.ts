import { describe, it, expect } from 'vitest'

const BACKEND_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@shennasstudio.com'
const ADMIN_PASSWORD = 'admin123'

describe('Admin Full Workflow Test', () => {
  it('should complete full admin login workflow with cookies', async () => {
    // Step 1: Login with email/password to get JWT token
    const loginResponse = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    })

    console.log('Login status:', loginResponse.status)
    expect(loginResponse.status).toBe(200)

    const loginData = await loginResponse.json()
    console.log('Login response:', loginData)
    expect(loginData).toHaveProperty('token')

    // Step 2: Create session cookie using JWT token
    const sessionResponse = await fetch(`${BACKEND_URL}/auth/session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important! This enables cookie handling
    })

    console.log('Session creation status:', sessionResponse.status)
    expect(sessionResponse.status).toBe(200)

    // Get cookies from session response
    const cookies = sessionResponse.headers.get('set-cookie')
    console.log('Session cookies received:', cookies)
    expect(cookies).toBeTruthy() // Should have a cookie now!

    // Step 3: Try to access admin endpoint with session cookies
    const meResponse = await fetch(`${BACKEND_URL}/admin/users/me`, {
      headers: {
        'Cookie': cookies || '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    console.log('Me endpoint status:', meResponse.status)
    const meData = await meResponse.json()
    console.log('Me endpoint response:', meData)

    if (meResponse.status !== 200) {
      console.error('❌ Admin /me endpoint failed!')
      console.error('This is why admin panel shows "Load Failed"')
      console.error('Response:', meData)

      // Log all response headers for debugging
      console.log('Response headers:')
      meResponse.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`)
      })
    }

    expect(meResponse.status).toBe(200)
    expect(meData.user).toHaveProperty('email', ADMIN_EMAIL)
  })

  it('should show what the admin panel needs to work', () => {
    console.log('\n==========================================')
    console.log('ADMIN PANEL AUTHENTICATION FLOW (Medusa v2)')
    console.log('==========================================')
    console.log('✓ Step 1: POST /auth/user/emailpass → returns JWT token')
    console.log('✓ Step 2: POST /auth/session with Bearer token → returns session cookie')
    console.log('✓ Step 3: Use session cookie for /admin/users/me and other requests')
    console.log('✓ CORS must allow credentials (Access-Control-Allow-Credentials: true)')
    console.log('==========================================\n')

    expect(true).toBe(true)
  })
})
