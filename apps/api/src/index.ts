import { Hono } from 'hono'
import { handleClerkWebhook } from './routes/webhooks/clerk'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'confessed-api' })
})

app.post('/webhooks/clerk', handleClerkWebhook)

export default app