export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const body = await readBody(event);

  const required = ['start_location', 'destination', 'distance', 'fare_id', 'user_id', 'driver_id'];
  const missing = required.filter((k) => body[k] === undefined || body[k] === null || body[k] === '');
  if (missing.length > 0) {
    throw createError({ statusCode: 400, statusMessage: `Missing required fields: ${missing.join(', ')}` });
  }

  const { start_location, destination } = body;

  // validate start/destination format "long,lat"
  const validateCoord = (s: any) => {
    if (typeof s !== 'string') return false;
    const parts = s.split(',');
    if (parts.length !== 2) return false;
    const lon = Number(parts[0]);
    const lat = Number(parts[1]);
    return !Number.isNaN(lon) && !Number.isNaN(lat);
  };

  if (!validateCoord(start_location) || !validateCoord(destination)) {
    throw createError({ statusCode: 400, statusMessage: 'start_location and destination must be "long,lat"' });
  }

  const distance = Number(body.distance);
  const fare_id = Number(body.fare_id);
  const user_id = Number(body.user_id);
  const driver_id = Number(body.driver_id);

  if (Number.isNaN(distance) || Number.isNaN(fare_id) || Number.isNaN(user_id) || Number.isNaN(driver_id)) {
    throw createError({ statusCode: 400, statusMessage: 'distance, fare_id, user_id and driver_id must be numbers' });
  }

  const trip_start = body.trip_start || null; // optional, defaults to DB datetime('now') if schema uses default
  const trip_end = body.trip_end || null;

  try {
    const result = await db
      .prepare(
        `INSERT INTO trip (trip_start, trip_end, start_location, destination, distance, fare_id, user_id, driver_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(trip_start, trip_end, start_location, destination, distance, fare_id, user_id, driver_id)
      .run();

    setResponseStatus(event, 201);
    return {
      success: true,
      message: 'Trip created',
      data: {
        id: result.meta.last_row_id,
        trip_start: trip_start || null,
        trip_end: trip_end || null,
        start_location,
        destination,
        distance,
        fare_id,
        user_id,
        driver_id
      }
    };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to create trip' });
  }
});
