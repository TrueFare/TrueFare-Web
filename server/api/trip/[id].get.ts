export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Trip ID is required' });
  }

  try {
    const result = await db
      .prepare(
        'SELECT id, trip_start, trip_end, start_location, destination, distance, fare_id, user_id, driver_id FROM trip WHERE id = ?'
      )
      .bind(id)
      .run();

    return result;
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to fetch trip' });
  }
});
