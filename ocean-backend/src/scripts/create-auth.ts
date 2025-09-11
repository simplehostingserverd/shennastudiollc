import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createAuthForUser({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userService = container.resolve(Modules.USER)

  // Use the reset admin we created
  const adminEmail = "reset@shennastudio.com"
  const adminPassword = "Reset123!"

  try {
    // Find the user
    const users = await userService.listUsers({ email: adminEmail })
    if (users.length === 0) {
      throw new Error(`User not found: ${adminEmail}`)
    }
    
    const user = users[0]
    logger.info(`📧 Found user: ${user.email} (ID: ${user.id})`)

    // Get database connection
    const connection = container.resolve("db_connection")
    
    // Generate IDs
    const authIdPrefix = "authid_"
    const providerIdPrefix = ""
    const authIdentityId = authIdPrefix + generateId()
    const providerIdentityId = generateId()

    // Create auth_identity record
    await connection.query(`
      INSERT INTO auth_identity (id, app_metadata, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
    `, [authIdentityId, JSON.stringify({ user_id: user.id })])

    logger.info(`✅ Created auth_identity: ${authIdentityId}`)

    // Hash the password using scrypt (same as existing)
    const crypto = require('crypto')
    const salt = crypto.randomBytes(16)
    const hashedPassword = crypto.scryptSync(adminPassword, salt, 64)
    const passwordHash = `scrypt\0${salt.length.toString(16).padStart(8, '0')}\0\0\0\0${salt.toString('hex')}${hashedPassword.toString('hex')}`
    const base64Hash = Buffer.from(passwordHash, 'hex').toString('base64')

    // Create provider_identity record  
    await connection.query(`
      INSERT INTO provider_identity (id, entity_id, provider, auth_identity_id, provider_metadata, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    `, [
      providerIdentityId,
      adminEmail,
      'emailpass', 
      authIdentityId,
      JSON.stringify({ password: base64Hash })
    ])

    logger.info(`✅ Created provider_identity: ${providerIdentityId}`)

    logger.info("🎉 AUTHENTICATION SETUP COMPLETE!")
    logger.info(`📧 Email: ${adminEmail}`)
    logger.info(`🔐 Password: ${adminPassword}`)
    logger.info(`🌐 Login at: http://localhost:9001/app`)

  } catch (error) {
    logger.error(`❌ Error creating auth: ${error}`)
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