import { describe, it, expect, beforeAll } from 'vitest'

const BACKEND_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@shennasstudio.com'
const ADMIN_PASSWORD = 'admin123'

describe('Admin Login Integration Tests', () => {
  let authToken: string

  it('should successfully login with valid credentials', async () => {
    const response = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('token')
    authToken = data.token
  })

  it('should fetch admin user details with valid token', async () => {
    const response = await fetch(`${BACKEND_URL}/admin/users/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Admin user response status:', response.status)
    const data = await response.json()
    console.log('Admin user response:', data)

    // This test will help us see what's failing
    if (response.status !== 200) {
      console.error('Failed to fetch admin user. Response:', data)
    }

    expect(response.status).toBe(200)
    expect(data.user).toHaveProperty('email', ADMIN_EMAIL)
  })

  it('should reject login with invalid credentials', async () => {
    const response = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: 'wrongpassword',
      }),
    })

    expect(response.status).toBe(401)
  })
})
