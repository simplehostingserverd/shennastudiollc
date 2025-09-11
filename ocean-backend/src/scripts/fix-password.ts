import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function fixPassword({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const adminEmail = "working@shennastudio.com"
  const adminPassword = "Working123!"

  try {
    logger.info("🔧 Creating properly formatted admin credentials...")

    const { Client } = await import('pg')
    const client = new Client({
      connectionString: 'postgresql://postgres:OCD1hg3mTa1170ND@db.ncmpqawcsdlnnhpsgjvz.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    })

    await client.connect()

    // Create user first
    const userId = 'user_' + generateId()
    await client.query(`
      INSERT INTO "user" (id, email, first_name, last_name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
    `, [userId, adminEmail, 'Working', 'Admin'])

    // Create auth_identity  
    const authIdentityId = 'authid_' + generateId()
    await client.query(`
      INSERT INTO auth_identity (id, app_metadata, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
    `, [authIdentityId, JSON.stringify({ user_id: userId })])

    // Create password hash using EXACT same format as existing working one
    const crypto = await import('crypto')
    
    // Format from existing: scrypt + 0x00 + 0x0f + 6 zero bytes + 0x08 + 4 zero bytes + salt(16) + hash(64)
    const salt = crypto.randomBytes(16)
    const key = crypto.scryptSync(adminPassword, salt, 64)
    
    // Build the exact format: "scrypt" + null + params + salt + key
    const header = Buffer.from([
      0x73, 0x63, 0x72, 0x79, 0x70, 0x74, // "scrypt"
      0x00, // null terminator
      0x0f, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01 // parameters (matches existing)
    ])
    
    const combined = Buffer.concat([header, salt, key])
    const base64Hash = combined.toString('base64')

    // Create provider_identity
    const providerIdentityId = generateId()
    await client.query(`
      INSERT INTO provider_identity (id, entity_id, provider, auth_identity_id, provider_metadata, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    `, [
      providerIdentityId,
      adminEmail,
      'emailpass',
      authIdentityId,
      JSON.stringify({ password: base64Hash })
    ])

    await client.end()

    logger.info("🎉 FIXED ADMIN CREATED!")
    logger.info("=" * 50)
    logger.info(`📧 Email: ${adminEmail}`)
    logger.info(`🔐 Password: ${adminPassword}`)
    logger.info(`🌐 Admin URL: http://localhost:9001/app`)
    logger.info("=" * 50)

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