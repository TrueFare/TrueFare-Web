export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const results = await db.prepare(
      `SELECT r.id, r.user_id, r.trip_id, r.driver_id, r.report_details, r.status, r.date_created,
        u.first_name || ' ' || u.last_name AS user_name,
        d.first_name || ' ' || d.last_name AS driver_name
      FROM report r
      LEFT JOIN user u ON r.user_id = u.id
      LEFT JOIN driver d ON r.driver_id = d.id
      ORDER BY r.date_created DESC
      LIMIT ? OFFSET ?`
    )
    .bind(limit, offset)
    .all();

    const totalCount = await db
      .prepare("SELECT COUNT(*) as count FROM report")
      .first("count");

    return {
      results: results.results,
      total: totalCount,
      page,
      limit
    };
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch reports");
  }
});
