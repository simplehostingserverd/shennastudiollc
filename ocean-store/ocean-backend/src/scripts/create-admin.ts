const createAdminUser = async () => {
  console.log("🔧 Admin User Setup Instructions")
  console.log("================================")
  
  // Default admin credentials from environment
  const adminEmail = process.env.ADMIN_EMAIL || "admin@shennasstudio.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!"
  
  console.log("")
  console.log("📧 Default Admin Email:", adminEmail)
  console.log("🔐 Default Admin Password:", adminPassword)
  console.log("")
  console.log("🌐 Admin Panel URLs:")
  console.log("  • Local: http://localhost:7001/app")
  console.log("  • Production: https://admin.shennasstudio.com/app")
  console.log("")
  console.log("📝 Setup Instructions:")
  console.log("  1. Start the Medusa server")
  console.log("  2. Navigate to the admin panel URL")
  console.log("  3. Create your admin user through the UI")
  console.log("  4. Use the credentials above or set ADMIN_EMAIL/ADMIN_PASSWORD env vars")
  console.log("")
  console.log("⚠️  IMPORTANT SECURITY NOTES:")
  console.log("  • Change default credentials immediately")
  console.log("  • Use strong passwords in production")
  console.log("  • Set proper CORS settings")
  console.log("")
  console.log("✅ Admin setup information displayed successfully!")
}

export default createAdminUser

// Run the script if called directly
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log("✨ Setup information displayed!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("💥 Error:", error)
      process.exit(1)
    })
}