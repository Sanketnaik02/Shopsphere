import express, { type Express } from 'express'
import cors from 'cors'
import apiRouter from './routes'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'
import env from './config/env'

const app: Express = express()

app.use(cors({ origin: env.frontendUrl, credentials: true }))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'ShopSphere API' })
})

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
