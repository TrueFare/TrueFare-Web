export default defineEventHandler(async (event) => {
  const table = event.context.params?.table as string;
  const db = event.context.cloudflare.env.truefare_db;
  const result = await db.prepare(`SELECT * FROM ${table}`).run();
  return result;
});