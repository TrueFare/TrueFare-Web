export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const search = (query.search as string) || "";
  const todaId = query.todaId as string || "";
  const offset = (page - 1) * limit;

  try {
    let whereClause = "";
    let params: any[] = [];
    const conditions: string[] = [];

    if (search) {
      conditions.push(`(r.id LIKE ? OR r.report_details LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR d.first_name LIKE ? OR d.last_name LIKE ? OR d.plate_number LIKE ?)`);
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam);
    }

    if (todaId) {
      conditions.push(`d.toda_id = ?`);
      params.push(todaId);
    }

    if (conditions.length > 0) {
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    const results = await db.prepare(
      `SELECT r.id, r.user_id, r.trip_id, r.driver_id, r.report_details, r.status, r.date_created,
        u.first_name || ' ' || u.last_name AS user_name,
        u.contact_number AS user_contact,
        d.first_name || ' ' || d.last_name AS driver_name,
        d.plate_number,
        d.contact_number AS driver_contact,
        t.trip_start,
        t.trip_end,
        t.start_location,
        t.destination,
        t.distance
      FROM report r
      LEFT JOIN user u ON r.user_id = u.id
      LEFT JOIN driver d ON r.driver_id = d.id
      LEFT JOIN trip t ON r.trip_id = t.id
      ${whereClause}
      ORDER BY r.date_created DESC
      LIMIT ? OFFSET ?`
    )
    .bind(...params, limit, offset)
    .all();

    const totalCount = await db
      .prepare(`
        SELECT COUNT(*) as count 
        FROM report r
        LEFT JOIN user u ON r.user_id = u.id
        LEFT JOIN driver d ON r.driver_id = d.id
        ${whereClause}
      `)
      .bind(...params)
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
