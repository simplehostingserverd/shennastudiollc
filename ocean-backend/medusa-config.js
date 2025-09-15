const { loadEnv, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV || 'production', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    // Database connection via Supabase (external Postgres)
    databaseUrl: process.env.DATABASE_URL,
    // SSL / driver options needed if Supabase requires TLS
    databaseDriverOptions: {
      connection: process.env.DATABASE_SSL === 'true'
        ? {
            ssl: {
              // When using self-signed or less strict certs, you might set this to false
              rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
            }
          }
        : false,
    },

    // Redis for sessions, caches etc.
    redisUrl: process.env.REDIS_URL,
    // Additional Redis options for authentication
    redisOptions: {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
    },

    // HTTP / security settings
    http: {
      // CORS origins for your store and admin
      storeCors: process.env.STORE_CORS || '*',
      adminCors: process.env.ADMIN_CORS || '*',
      authCors: process.env.AUTH_CORS || process.env.ADMIN_CORS || '*',

      // JWT & Cookie secrets must be strong in production
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,

      // Production-ready cookie settings
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',       // HTTPS only in production
        httpOnly: true,                                      // Prevent XSS attacks
        sameSite: (process.env.COOKIE_SAMESITE || 'lax'),   // CSRF protection
        maxAge: 24 * 60 * 60 * 1000,                       // 24 hours
      },
    },

    // Logging: suppress verbose in production, but useful for debugging when needed
    databaseLogging: process.env.DATABASE_LOGGING === 'true' || false,
  },

  // Admin dashboard config - DISABLED for now to fix deployment
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
    // path if needed to customize
    path: process.env.ADMIN_PATH || '/app',
    // If building admin separately, outDir etc
    outDir: process.env.ADMIN_BUILD_DIR || './build',
    // Disable admin dashboard to prevent build errors
    disable: true,
  },

  // Modules & Plugins (empty by default, add if needed)
  modules: {},

  // Feature flags if you want to enable certain Medusa features
  featureFlags: {
    // Example flags
    // analytics: process.env.FEATURE_ANALYTICS === 'true',
    // product_categories: process.env.FEATURE_PRODUCT_CATEGORIES === 'true',
  },
})