import { loadEnv, defineConfig } from '@medusajs/framework/utils'

// Load environment variables based on NODE_ENV
loadEnv(process.env.NODE_ENV || 'production', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    // Database URL (Required - from Railway PostgreSQL)
    databaseUrl: process.env.DATABASE_URL,

    // Database name (Optional - extracted from DATABASE_URL if not provided)
    databaseName: process.env.DATABASE_NAME || 'railway',

    // Database driver options for SSL connections (Railway requires SSL)
    databaseDriverOptions: process.env.DATABASE_URL?.startsWith('sqlite:')
      ? undefined
      : {
          connection: {
            ssl:
              process.env.NODE_ENV === 'production' ||
              process.env.DATABASE_SSL === 'true'
                ? {
                    rejectUnauthorized:
                      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true',
                  }
                : false,
          },
          pool: {
            min: 2,
            max: 10,
          },
        },

    // Redis URL (Required for production with Redis modules - from Railway)
    redisUrl: process.env.REDIS_URL,

    // Worker mode configuration (shared | worker | server)
    workerMode: (process.env.WORKER_MODE || 'shared') as
      | 'shared'
      | 'worker'
      | 'server',

    // HTTP Configuration
    http: {
      // CORS - Store API (Production domains)
      storeCors:
        process.env.STORE_CORS ||
        'https://shennastudio.com,https://www.shennastudio.com',

      // CORS - Admin API (Production domains)
      adminCors: process.env.ADMIN_CORS || 'https://api.shennastudio.com',

      // CORS - Authentication (Production domains)
      authCors:
        process.env.AUTH_CORS ||
        'https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com',

      // JWT Secret for token generation (Required - min 32 characters)
      jwtSecret: process.env.JWT_SECRET || 'supersecret',

      // Cookie Secret for session signing (Required - min 32 characters)
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',

      // Compression settings for production
      compression: {
        enabled: process.env.NODE_ENV === 'production',
        level: 6,
        threshold: 1024,
      },

      // Temporarily disable publishable key requirement for troubleshooting
      authMethodsStore: ['session'],
    },

    // Database logging (disabled in production for performance)
    databaseLogging: process.env.DATABASE_LOGGING === 'true',
  },

  // Admin Dashboard Configuration
  admin: {
    // Disable admin dashboard (default: false)
    disable: process.env.DISABLE_ADMIN === 'true',

    // Backend URL for admin panel (Production URL)
    backendUrl:
      process.env.BACKEND_URL ||
      process.env.MEDUSA_BACKEND_URL ||
      'https://api.shennastudio.com',

    // Admin dashboard path (default: /app)
    path: '/app' as `/${string}`,

    // Disable development features in production
    outDir: '.medusa/admin',
  },

  // Module Registrations
  modules: [
    // Redis Cache Module
    {
      resolve: '@medusajs/medusa/cache-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
        // TTL in seconds (5 minutes for production)
        ttl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 300,
        // Namespace for cache keys
        namespace: 'medusa',
      },
    },
    // Redis Event Bus Module
    {
      resolve: '@medusajs/medusa/event-bus-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    // Redis Workflow Engine Module
    {
      resolve: '@medusajs/medusa/workflow-engine-redis',
      options: {
        redis: {
          url: process.env.REDIS_URL,
          // Connection retry strategy
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000)
            return delay
          },
        },
      },
    },
  ],

  // Feature Flags (Optional - for beta features)
  featureFlags: {
    // Enable any production feature flags here
  },
})
