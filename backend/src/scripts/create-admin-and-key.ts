import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'
import { linkSalesChannelsToApiKeyWorkflow } from '@medusajs/medusa/core-flows'

export default async function createAdminAndKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userService = container.resolve(Modules.USER)
  const authService = container.resolve(Modules.AUTH)
  const apiKeyService = container.resolve(Modules.API_KEY)

  // Admin credentials - NEW SECURE PASSWORD
  const adminEmail = 'admin@shennastudio.com'
  const adminPassword = 'ShennasOcean2024!Secure'

  try {
    logger.info('🔍 Checking for existing admin user...')

    // Check if admin already exists
    const existingUsers = await userService.listUsers({
      email: adminEmail,
    })

    let adminUserId
    if (existingUsers && existingUsers.length > 0) {
      logger.info('⚠️  Admin user already exists, recreating with new password...')

      // Delete existing user and recreate to ensure proper auth setup
      const adminUser = existingUsers[0]
      await userService.deleteUsers([adminUser.id])

      // Create the admin user fresh
      const newAdminUser = await userService.createUsers({
        email: adminEmail,
        first_name: 'Admin',
        last_name: 'User',
      })

      adminUserId = Array.isArray(newAdminUser) ? newAdminUser[0].id : newAdminUser.id

      // Create auth identity with password using emailpass provider
      await authService.createAuthIdentities({
        provider_identities: [
          {
            provider: 'emailpass',
            entity_id: adminUserId,
            provider_metadata: {
              email: adminEmail,
              password: adminPassword,
            },
          },
        ],
      })

      logger.info('✅ Admin user recreated successfully!')
    } else {
      logger.info('👤 Creating new admin user...')

      // Create new admin user
      const adminUser = await userService.createUsers({
        email: adminEmail,
        first_name: 'Admin',
        last_name: 'User',
      })

      adminUserId = Array.isArray(adminUser) ? adminUser[0].id : adminUser.id

      // Create auth identity with password
      await authService.createAuthIdentities({
        provider_identities: [
          {
            provider: 'emailpass',
            entity_id: adminUserId,
            provider_metadata: {
              email: adminEmail,
              password: adminPassword,
            },
          },
        ],
      })

      logger.info('✅ Admin user created successfully!')
    }

    // Get or create sales channel
    logger.info('🏪 Setting up sales channel...')
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

    let salesChannel
    const existingChannels = await salesChannelService.listSalesChannels()
    if (existingChannels && existingChannels.length > 0) {
      salesChannel = existingChannels[0]
      logger.info(`✅ Using existing sales channel: ${salesChannel.name}`)
    } else {
      const createdChannel = await salesChannelService.createSalesChannels({
        name: 'Default Sales Channel',
        description: 'Default sales channel for the store',
      })
      salesChannel = Array.isArray(createdChannel) ? createdChannel[0] : createdChannel
      logger.info(`✅ Sales channel created: ${salesChannel.name}`)
    }

    // Create publishable API key for the storefront
    logger.info('🔑 Creating publishable API key...')

    // Check if a publishable key already exists
    const existingKeys = await apiKeyService.listApiKeys({
      type: 'publishable',
    })

    let apiKey
    if (existingKeys && existingKeys.length > 0) {
      apiKey = existingKeys[0]
      logger.info(`✅ Using existing publishable API key`)
    } else {
      const createdKey = await apiKeyService.createApiKeys({
        title: 'Storefront Key',
        type: 'publishable',
        created_by: adminUserId,
      })
      apiKey = Array.isArray(createdKey) ? createdKey[0] : createdKey
      logger.info(`✅ Publishable API key created`)
    }

    // Link API key to sales channel
    logger.info('🔗 Linking API key to sales channel...')

    try {
      await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
          id: apiKey.id,
          add: [salesChannel.id],
        },
      })
      logger.info(`✅ API key linked to sales channel`)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage.includes('already') || errorMessage.includes('exist')) {
        logger.info(`✅ API key already linked to sales channel`)
      } else {
        logger.warn(`⚠️  Could not link API key: ${errorMessage}`)
      }
    }

    // Console log the credentials
    console.log('\n' + '='.repeat(70))
    console.log('🎉 ADMIN CREDENTIALS & API KEY')
    console.log('='.repeat(70))
    console.log(`📧 Email: ${adminEmail}`)
    console.log(`🔐 Password: ${adminPassword}`)
    console.log(`🔑 Publishable API Key: ${apiKey.token}`)
    console.log(`🌐 Admin Panel URL: http://localhost:9000/app`)
    console.log('='.repeat(70))
    console.log('⚠️  IMPORTANT: Add this to your frontend .env file:')
    console.log(`NEXT_PUBLIC_PUBLISHABLE_API_KEY=${apiKey.token}`)
    console.log('='.repeat(70) + '\n')

    logger.info('✅ Setup completed successfully!')

  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    logger.error('❌ Error during setup:', errorObj)
    throw errorObj
  }
}
