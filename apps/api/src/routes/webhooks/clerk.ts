import { Webhook } from 'svix'
import type { Context } from 'hono'
import { db, users, userPreferences } from '@confessed/db'

export async function handleClerkWebhook(c: Context) {
  const body = await c.req.text()
  const headers = {
    'svix-id': c.req.header('svix-id')!,
    'svix-timestamp': c.req.header('svix-timestamp')!,
    'svix-signature': c.req.header('svix-signature')!,
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let event: any

  try {
    event = wh.verify(body, headers)
  } catch {
    return c.json({ error: 'Invalid webhook signature' }, 400)
  }

  if (event.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = event.data
    const email = email_addresses[0]?.email_address

    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          clerkId: id,
          email,
          emailVerified:
            email_addresses[0]?.verification?.status === 'verified',
          displayName:
            [first_name, last_name].filter(Boolean).join(' ') || null,
          avatarUrl: image_url,
          role: 'regular',
        })
        .returning()

      await tx.insert(userPreferences).values({ userId: user.id })
    })
  }

  return c.json({ received: true })
}