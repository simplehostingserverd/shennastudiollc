import { describe, it, expect } from 'vitest'

const BACKEND_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@shennasstudio.com'
const ADMIN_PASSWORD = 'admin123'

describe('Admin Authentication - Bearer Token Method', () => {
  it('should work with Bearer token in Authorization header', async () => {
    // Step 1: Login
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

    expect(loginResponse.status).toBe(200)
    const { token } = await loginResponse.json()
    console.log('✅ Login successful, token received')

    // Step 2: Use token in Authorization header for /admin/users/me
    const meResponse = await fetch(`${BACKEND_URL}/admin/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Admin /me status:', meResponse.status)
    const meData = await meResponse.json()
    console.log('Admin /me response:', meData)

    if (meResponse.status === 200) {
      console.log('✅ Bearer token authentication WORKS!')
      console.log('This means the admin panel should use Bearer tokens, not cookies')
    } else {
      console.log('❌ Bearer token authentication also fails')
      console.log('The issue is deeper than cookie vs token')
    }

    expect(meResponse.status).toBe(200)
    expect(meData.user).toHaveProperty('email', ADMIN_EMAIL)
  })
})
