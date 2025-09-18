import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'

export default async function debugAuth({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userService = container.resolve(Modules.USER)
  const authService = container.resolve(Modules.AUTH)

  try {
    // List all users
    logger.info('🔍 Listing all users...')
    const users = await userService.listUsers()
    logger.info(`Found ${users.length} users:`)
    users.forEach(user => {
      logger.info(`- ID: ${user.id}, Email: ${user.email}`)
    })

    // List all auth identities
    logger.info('🔍 Listing all auth identities...')
    const identities = await authService.listAuthIdentities()
    logger.info(`Found ${identities.length} auth identities:`)
    identities.forEach(identity => {
      logger.info(`- Entity ID: ${identity.entity_id}, Provider: ${identity.provider}`)
    })

    // Check specifically for admin user
    const adminUsers = await userService.listUsers({
      email: process.env.ADMIN_EMAIL || 'admin@shennastudio.com'
    })

    if (adminUsers.length > 0) {
      const adminUser = adminUsers[0]
      logger.info(`✅ Admin user found: ${adminUser.email} (ID: ${adminUser.id})`)

      // Check auth identities for this user
      const adminIdentities = identities.filter(i => i.entity_id === adminUser.id)
      logger.info(`Found ${adminIdentities.length} auth identities for admin user:`)
      adminIdentities.forEach(identity => {
        logger.info(`- Provider: ${identity.provider}`)
        logger.info(`- Provider metadata keys: ${Object.keys(identity.provider_metadata || {})}`)
      })
    } else {
      logger.warn('❌ No admin user found!')
    }

  } catch (error) {
    logger.error(`❌ Error debugging auth: ${error}`)
    throw error
  }
}