import { Hono } from 'hono'
import { handleClerkWebhook } from './routes/webhooks/clerk'
import me from './routes/me'
import type { AppVariables } from './types'

const app = new Hono<{ Variables: AppVariables }>()

app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'confessed-api' })
})

app.post('/webhooks/clerk', handleClerkWebhook)
app.route('/me', me)

export default app