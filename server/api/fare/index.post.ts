export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const body = await readBody(event);

  const required = ['base_km', 'base_fare', 'fare_per_km'];
  const missing = required.filter((k) => body[k] === undefined || body[k] === null || body[k] === '');
  if (missing.length > 0) {
    throw createError({ statusCode: 400, statusMessage: `Missing required fields: ${missing.join(', ')}` });
  }

  // coerce numeric values
  const base_km = Number(body.base_km);
  const base_fare = Number(body.base_fare);
  const fare_per_km = Number(body.fare_per_km);

  if (Number.isNaN(base_km) || Number.isNaN(base_fare) || Number.isNaN(fare_per_km)) {
    throw createError({ statusCode: 400, statusMessage: 'base_km, base_fare and fare_per_km must be numbers' });
  }

  try {
    const result = await db
      .prepare('INSERT INTO fare (base_km, base_fare, fare_per_km) VALUES (?, ?, ?)')
      .bind(base_km, base_fare, fare_per_km)
      .run();

    setResponseStatus(event, 201);
    return {
      success: true,
      message: 'Fare created',
      data: {
        id: result.meta.last_row_id,
        base_km,
        base_fare,
        fare_per_km
      }
    };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to create fare' });
  }
});
