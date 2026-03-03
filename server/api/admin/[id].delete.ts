export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = event.context.params?.id;

  await db.prepare(`DELETE FROM admin WHERE id = ?`).bind(id).run();

  return { success: true };
});
