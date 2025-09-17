import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createAdminUser({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userService = container.resolve(Modules.USER)
  const authService = container.resolve(Modules.AUTH)

  // Admin credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || "admin@shennastudio.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!"

  try {
    // Check if admin user already exists
    const existingUsers = await userService.listUsers({
      email: adminEmail,
    })

    if (existingUsers.length > 0) {
      logger.info(`✅ Admin user already exists: ${adminEmail}`)

      // Update the password for existing user
      const adminUser = existingUsers[0]

      // Create or update auth identity
      try {
        await authService.createAuthIdentities({
          provider_identities: [{
            provider: "manual",
            entity_id: adminUser.id,
            provider_metadata: {
              email: adminEmail,
              password: adminPassword
            }
          }]
        })
        logger.info("🔄 Updated admin password")
      } catch {
        // If identity exists, update it
        logger.info("🔄 Auth identity already exists")
      }

      logger.info(`📧 Email: ${adminEmail}`)
      logger.info(`🔐 Password: ${adminPassword}`)
      logger.info("🌐 Admin Panel URL: http://localhost:9000/app")
      return
    }

    // Create the admin user
    const adminUser = await userService.createUsers({
      email: adminEmail,
      first_name: "Admin",
      last_name: "User",
    })

    // Create auth identity with password
    await authService.createAuthIdentities({
      provider_identities: [{
        provider: "manual",
        entity_id: Array.isArray(adminUser) ? adminUser[0].id : adminUser.id,
        provider_metadata: {
          email: adminEmail,
          password: adminPassword
        }
      }]
    })

    logger.info("✅ Admin user created successfully!")
    logger.info(`📧 Email: ${adminEmail}`)
    logger.info(`🔐 Password: ${adminPassword}`)
    logger.info("🌐 Admin Panel URL: http://localhost:9000/app")
    logger.warn("⚠️  IMPORTANT: Use these credentials to log in!")
    logger.warn("⚠️  IMPORTANT: Change the password after first login!")

  } catch (error) {
    logger.error(`❌ Error creating admin user: ${error}`)
    throw error
  }
}

// Export the function as default for use with `medusa exec`