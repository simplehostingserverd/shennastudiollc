import { MedusaApp, Modules } from "@medusajs/framework/utils"

const createAdminUser = async () => {
  const { modules } = await MedusaApp({
    modulesConfig: {
      [Modules.USER]: {
        resolve: "@medusajs/user",
      },
    },
  })

  const userService = modules.user

  // Default admin credentials - change these in production!
  const adminEmail = process.env.ADMIN_EMAIL || "admin@shennasstudio.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!"

  try {
    // Check if admin user already exists
    const existingUser = await userService.list({
      email: adminEmail,
    })

    if (existingUser.length > 0) {
      console.log("✅ Admin user already exists:", adminEmail)
      return
    }

    // Create the admin user
    const adminUser = await userService.create({
      email: adminEmail,
      first_name: "Admin",
      last_name: "User",
    })

    console.log("✅ Admin user created successfully!")
    console.log("📧 Email:", adminEmail)
    console.log("🔐 Password:", adminPassword)
    console.log("🌐 Admin Panel URL: http://localhost:7001")
    console.log("🚀 Production Admin URL: https://your-domain.com:7001")
    console.log("")
    console.log("⚠️  IMPORTANT: Change the default password immediately after first login!")
    console.log("⚠️  IMPORTANT: Use strong credentials for production!")

  } catch (error) {
    console.error("❌ Error creating admin user:", error)
    throw error
  }
}

export default createAdminUser

// Run the script if called directly
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log("✨ Setup completed!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("💥 Setup failed:", error)
      process.exit(1)
    })
}