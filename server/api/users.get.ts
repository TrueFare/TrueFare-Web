export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const result = await db.prepare("SELECT * FROM USER").run();
  return result;
});