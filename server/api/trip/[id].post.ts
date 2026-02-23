export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Trip ID is required' });
  }

  const { trip_end } = body;
  if (!trip_end) {
    throw createError({ statusCode: 400, statusMessage: 'trip_end is required' });
  }

  try {
    await db.prepare('UPDATE trip SET trip_end = ? WHERE id = ?').bind(trip_end, id).run();

    const updated = await db
      .prepare('SELECT id, trip_start, trip_end, start_location, destination, distance, fare_id, user_id, driver_id FROM trip WHERE id = ?')
      .bind(id)
      .run();

    return {
      success: true,
      message: 'Trip updated',
      data: updated
    };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to update trip' });
  }
});
