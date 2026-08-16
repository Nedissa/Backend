module.exports = {
  apps: [
    {
      name: 'medusa',
      script: 'npx',
      args: 'medusa start',
      cwd: '/opt/medusa-backend/apps/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: process.env.DATABASE_URL,
        STORE_CORS: process.env.STORE_CORS,
        ADMIN_CORS: process.env.ADMIN_CORS,
        AUTH_CORS: process.env.AUTH_CORS,
        REDIS_URL: process.env.REDIS_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        COOKIE_SECRET: process.env.COOKIE_SECRET,
      }
    }
  ]
};
