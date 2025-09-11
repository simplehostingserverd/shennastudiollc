import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createAdminUser({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userService = container.resolve(Modules.USER)

  // Fresh admin credentials - using a different email to create a new admin
  const adminEmail = "newadmin@shennastudio.com"
  const adminPassword = "NewPassword123!"

  try {
    // Check if this new admin user already exists
    const existingUsers = await userService.listUsers({
      email: adminEmail,
    })

    if (existingUsers.length > 0) {
      logger.info(`✅ New admin user already exists: ${adminEmail}`)
      logger.info(`📧 Email: ${adminEmail}`)
      logger.info(`🔐 Password: ${adminPassword}`)
      logger.info("🌐 Admin Panel URL: http://localhost:9001/app")
      return
    }

    // Create the new admin user
    await userService.createUsers({
      email: adminEmail,
      first_name: "New",
      last_name: "Admin",
    })

    logger.info("✅ New admin user created successfully!")
    logger.info(`📧 Email: ${adminEmail}`)
    logger.info(`🔐 Password: ${adminPassword}`)
    logger.info("🌐 Admin Panel URL: http://localhost:9001/app")
    logger.warn("⚠️  IMPORTANT: Use these credentials to log in!")
    logger.warn("⚠️  IMPORTANT: Change the password after first login!")

  } catch (error) {
    logger.error(`❌ Error creating new admin user: ${error}`)
    throw error
  }
}

// Export the function as default for use with `medusa exec`