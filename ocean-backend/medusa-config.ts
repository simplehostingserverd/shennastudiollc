import { loadEnv, defineConfig } from "@medusajs/framework/utils";

// Load environment variables based on NODE_ENV
loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    // Database URL (Required)
    databaseUrl: process.env.DATABASE_URL,

    // Database name (Optional - extracted from DATABASE_URL if not provided)
    databaseName: process.env.DATABASE_NAME,

    // Database driver options for SSL connections
    databaseDriverOptions: process.env.DATABASE_URL?.startsWith('sqlite:')
      ? undefined
      : process.env.DATABASE_SSL === 'true'
        ? {
            connection: {
              ssl: {
                rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
              }
            }
          }
        : {
            connection: {
              ssl: false  // Explicitly disable SSL when DATABASE_SSL is not 'true'
            }
          },

    // Redis URL (Required for production with Redis modules)
    redisUrl: process.env.REDIS_URL,

    // Worker mode configuration (shared | worker | server)
    workerMode: (process.env.WORKER_MODE || "shared") as "shared" | "worker" | "server",

    // HTTP Configuration
    http: {
      // CORS - Store API (Required)
      storeCors: process.env.STORE_CORS || "http://localhost:3000",

      // CORS - Admin API (Required)
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",

      // CORS - Authentication (Required)
      authCors: process.env.AUTH_CORS || "http://localhost:3000",

      // JWT Secret for token generation (Required - min 32 characters)
      jwtSecret: process.env.JWT_SECRET || "supersecret",

      // Cookie Secret for session signing (Required - min 32 characters)
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",

      // Cookie options for authentication
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
      },

      // Session options
      sessionOptions: {
        name: "connect.sid",
        resave: false,
        rolling: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET || "supersecret",
        ttl: 10 * 24 * 60 * 60 * 1000, // 10 days
      },
    },

    // Database logging (useful for debugging)
    databaseLogging: process.env.DATABASE_LOGGING === "true",
  },

  // Admin Dashboard Configuration
  admin: {
    // Disable admin dashboard (default: false)
    disable: process.env.DISABLE_ADMIN === "true",

    // Backend URL for admin panel
    backendUrl: process.env.BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",

    // Admin dashboard path (default: /app)
    path: "/app" as `/${string}`,
  },

  // Module Registrations
  modules: [
    // Redis Cache Module
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
        // Optional: TTL in seconds
        ttl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 30,
      },
    },
    // Redis Event Bus Module
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    // Redis Workflow Engine Module
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },
  ],

  // Feature Flags (Optional - for beta features)
  featureFlags: {
    // Example: Enable product categories
    // product_categories: process.env.FEATURE_PRODUCT_CATEGORIES === "true",
  },
});
