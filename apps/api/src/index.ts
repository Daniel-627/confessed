import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'confessed-api' })
})

export default app