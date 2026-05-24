import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || 'https://techpilots.vercel.app',
      adminCors: process.env.ADMIN_CORS || 'https://techpilots.vercel.app',
      authCors: process.env.AUTH_CORS || 'https://techpilots.vercel.app',
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  }
})
