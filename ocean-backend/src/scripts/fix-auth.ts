import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'

export default async function fixAuth({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userService = container.resolve(Modules.USER)
  const authService = container.resolve(Modules.AUTH)

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shennastudio.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!'

  try {
    logger.info('🔧 Fixing auth identities...')

    // Delete all broken auth identities first
    logger.info('🗑️ Deleting broken auth identities...')
    const allIdentities = await authService.listAuthIdentities()
    for (const identity of allIdentities) {
      try {
        await authService.deleteAuthIdentities([identity.id])
        logger.info(`Deleted identity: ${identity.id}`)
      } catch (error) {
        logger.warn(`Failed to delete identity ${identity.id}: ${error}`)
      }
    }

    // Find the admin user
    const adminUsers = await userService.listUsers({
      email: adminEmail
    })

    if (adminUsers.length === 0) {
      logger.error(`❌ Admin user ${adminEmail} not found!`)
      return
    }

    const adminUser = adminUsers[0]
    logger.info(`✅ Found admin user: ${adminUser.email} (ID: ${adminUser.id})`)

    // Create proper auth identity
    logger.info('🔐 Creating auth identity...')
    const authIdentity = await authService.createAuthIdentities({
      provider_identities: [
        {
          provider: 'emailpass',
          entity_id: adminUser.id,
          provider_metadata: {
            email: adminEmail,
            password: adminPassword,
          },
        },
      ],
    })

    logger.info('✅ Auth identity created successfully!')
    logger.info(`📧 Email: ${adminEmail}`)
    logger.info(`🔐 Password: ${adminPassword}`)
    logger.info('🌐 Admin Panel URL: http://localhost:9000/app')
    logger.info('🚀 Try logging in now!')

  } catch (error) {
    logger.error(`❌ Error fixing auth: ${error}`)
    throw error
  }
}