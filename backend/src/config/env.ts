import 'dotenv/config'

const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:4000/api',
}

export default env
