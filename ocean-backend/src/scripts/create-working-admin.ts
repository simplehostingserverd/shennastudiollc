import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function createWorkingAdmin({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const adminEmail = "test@shennastudio.com"
  const adminPassword = "Test123!"

  try {
    logger.info("🔄 Creating working admin with direct database approach...")

    // Use Node.js pg client directly
    const { Client } = await import('pg') as any
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
    })

    await client.connect()
    logger.info("✅ Connected to database")

    // Check if user exists, if not create one
    let userId
    const existingUser = await client.query('SELECT id FROM "user" WHERE email = $1', [adminEmail])
    
    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id
      logger.info(`📧 Found existing user: ${userId}`)
    } else {
      // Generate user ID
      userId = 'user_' + generateId()
      await client.query(`
        INSERT INTO "user" (id, email, first_name, last_name, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [userId, adminEmail, 'Test', 'Admin'])
      logger.info(`✅ Created user: ${userId}`)
    }

    // Generate auth IDs
    const authIdentityId = 'authid_' + generateId()
    const providerIdentityId = generateId()

    // Create auth_identity
    await client.query(`
      INSERT INTO auth_identity (id, app_metadata, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [authIdentityId, JSON.stringify({ user_id: userId })])

    // Create a simple password hash (copying the format from existing)
    const crypto = await import('crypto')
    const passwordBuffer = Buffer.from(adminPassword, 'utf8')
    const salt = crypto.randomBytes(16)
    const key = crypto.scryptSync(passwordBuffer, salt, 64)
    
    // Format: "scrypt" + null + 8 bytes (salt length) + salt + key
    const saltLengthHex = salt.length.toString(16).padStart(8, '0')
    const combined = Buffer.concat([
      Buffer.from('scrypt\0' + saltLengthHex + '\0\0\0\0', 'binary'),
      salt,
      key
    ])
    const base64Hash = combined.toString('base64')

    // Create provider_identity
    await client.query(`
      INSERT INTO provider_identity (id, entity_id, provider, auth_identity_id, provider_metadata, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [
      providerIdentityId,
      adminEmail,
      'emailpass',
      authIdentityId,
      JSON.stringify({ password: base64Hash })
    ])

    await client.end()
    logger.info("🎉 ADMIN CREATED SUCCESSFULLY!")
    logger.info("==================================================")
    logger.info(`📧 Email: ${adminEmail}`)
    logger.info(`🔐 Password: ${adminPassword}`)
    logger.info(`🌐 Admin URL: http://localhost:9001/app`)
    logger.info("==================================================")

  } catch (error) {
    logger.error(`❌ Error: ${error}`)
    throw error
  }
}

function generateId(): string {
  const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
  let result = ''
  for (let i = 0; i < 26; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}