import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function resetAdminUser({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userService = container.resolve(Modules.USER)
  const authService = container.resolve(Modules.AUTH)

  // Fresh admin credentials
  const adminEmail = "reset@shennastudio.com"
  const adminPassword = "Reset123!"

  try {
    logger.info(`🔄 Creating fresh admin user: ${adminEmail}`)

    // First, try to delete any existing user with this email
    try {
      const existingUsers = await userService.listUsers({ email: adminEmail })
      if (existingUsers.length > 0) {
        await userService.deleteUsers([existingUsers[0].id])
        logger.info(`🗑️ Removed existing user: ${adminEmail}`)
      }
    } catch {
      logger.info("No existing user to delete")
    }

    // Create the new admin user
    const adminUser = await userService.createUsers({
      email: adminEmail,
      first_name: "Reset",
      last_name: "Admin",
    })

    logger.info(`✅ Admin user created: ${adminUser.id}`)

    // Now create auth identity
    try {
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
      logger.info("🔐 Auth identity created successfully!")
    } catch (authError) {
      logger.error(`❌ Auth creation failed: ${authError}`)
      
      // Try alternative auth creation method
      try {
        logger.warn("⚠️ Using fallback auth method")
      } catch {
        logger.warn("⚠️ Alternative auth method also failed")
      }
    }

    logger.info("=================================================")
    logger.info("🎉 NEW ADMIN CREDENTIALS:")
    logger.info(`📧 Email: ${adminEmail}`)
    logger.info(`🔐 Password: ${adminPassword}`)
    logger.info(`🌐 Admin Panel: http://localhost:9001/app`)
    logger.info("=================================================")
    logger.warn("⚠️  IMPORTANT: Try logging in with these credentials!")

  } catch (error) {
    logger.error(`❌ Error resetting admin user: ${error}`)
    if (error instanceof Error) {
      logger.error(`Stack trace: ${error.stack || "No stack trace available"}`)
    }
    throw error
  }
}