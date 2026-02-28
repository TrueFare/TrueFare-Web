export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

  try {
    const result = await db.prepare('SELECT COUNT(*) AS count FROM toda').run();
    const count = result && (result.results?.[0]?.count ?? result[0]?.count ?? 0);
    return { count: Number(count) };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to count toda' });
  }
});
