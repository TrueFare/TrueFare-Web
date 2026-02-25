export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const body = await readBody(event);

  const required = ['user_id', 'trip_id', 'driver_id', 'report_details'];
  const missing = required.filter((k) => body[k] === undefined || body[k] === null || body[k] === '');
  if (missing.length > 0) {
    throw createError({ statusCode: 400, statusMessage: `Missing required fields: ${missing.join(', ')}` });
  }

  const user_id = Number(body.user_id);
  const trip_id = Number(body.trip_id);
  const driver_id = Number(body.driver_id);
  const report_details = String(body.report_details);
  const status = body.status === undefined ? null : Number(body.status);

  try {
    const result = await db
      .prepare(`INSERT INTO report (user_id, trip_id, driver_id, report_details, status) VALUES (?, ?, ?, ?, ?)`)
      .bind(user_id, trip_id, driver_id, report_details, status)
      .run();

    setResponseStatus(event, 201);
    return {
      success: true,
      message: 'Report created',
      data: { id: result.meta.last_row_id, user_id, trip_id, driver_id, report_details, status }
    };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to create report' });
  }
});
