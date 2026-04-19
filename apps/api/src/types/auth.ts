import type { users } from '@confessed/db'

export type User = typeof users.$inferSelect

export type AppVariables = {
  user: User
}