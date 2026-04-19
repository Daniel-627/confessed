import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handleClerkWebhook } from './routes/webhooks/clerk'
import me from './routes/me'
import type { AppVariables } from './types'

const app = new Hono<{ Variables: AppVariables }>()

app.use('*', cors({
  origin: ['http://localhost:3000'],
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'confessed-api' })
})

app.post('/webhooks/clerk', handleClerkWebhook)
app.route('/me', me)

export default app