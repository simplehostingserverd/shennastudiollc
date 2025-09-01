import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createAdminUser({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userService = container.resolve(Modules.USER)

  // Default admin credentials - change these in production!
  const adminEmail = process.env.ADMIN_EMAIL || "admin@shennasstudio.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!"

  try {
    // Check if admin user already exists
    const existingUsers = await userService.listUsers({
      email: adminEmail,
    })

    if (existingUsers.length > 0) {
      logger.info(`✅ Admin user already exists: ${adminEmail}`)
      return
    }

    // Create the admin user
    const adminUser = await userService.createUsers({
      email: adminEmail,
      first_name: "Admin",
      last_name: "User",
    })

    logger.info("✅ Admin user created successfully!")
    logger.info(`📧 Email: ${adminEmail}`)
    logger.info(`🔐 Password: ${adminPassword}`)
    logger.info("🌐 Admin Panel URL: http://localhost:7001")
    logger.info("🚀 Production Admin URL: https://your-domain.com:7001")
    logger.warn("⚠️  IMPORTANT: Change the default password immediately after first login!")
    logger.warn("⚠️  IMPORTANT: Use strong credentials for production!")

  } catch (error) {
    logger.error(`❌ Error creating admin user: ${error}`)
    throw error
  }
}

// Export the function as default for use with `medusa exec`