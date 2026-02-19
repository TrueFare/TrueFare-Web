import type { D1Database } from '@cloudflare/workers-types'

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.database as D1Database
  if (!db) throw new Error('D1 binding not configured')

  const stmt = db.prepare('SELECT * FROM users')
  const { results } = await stmt.all()
  return results
})