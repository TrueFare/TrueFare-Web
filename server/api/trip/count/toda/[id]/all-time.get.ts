export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Toda ID is required' });
  }

  try {
    const result = await db
      .prepare(
        `SELECT COUNT(*) AS count FROM trip t JOIN driver d ON t.driver_id = d.id WHERE d.toda_id = ?`
      )
      .bind(id)
      .run();

    const count = result && (result.results?.[0]?.count ?? result[0]?.count ?? 0);
    return { count: Number(count) };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to count all-time trips for toda' });
  }
});
