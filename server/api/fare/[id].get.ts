export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Fare ID is required' });
  }

  try {
    const result = await db
      .prepare('SELECT id, base_km, base_fare, fare_per_km, date_created FROM fare WHERE id = ?')
      .bind(id)
      .run();

    return result;
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to fetch fare' });
  }
});
