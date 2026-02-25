export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

  try {
    const result = await db.prepare(
      `SELECT r.id, r.user_id, r.trip_id, r.driver_id, r.report_details, r.status, r.date_created,
        u.first_name || ' ' || u.last_name AS user_name,
        d.first_name || ' ' || d.last_name AS driver_name
      FROM report r
      LEFT JOIN user u ON r.user_id = u.id
      LEFT JOIN driver d ON r.driver_id = d.id
      ORDER BY r.date_created DESC`
    ).run();

    return result;
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to fetch reports' });
  }
});
