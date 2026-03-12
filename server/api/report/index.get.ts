export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const query = getQuery(event);
  
  const search = query.search?.toString() || "";
  const page = parseInt(query.page?.toString() || "1");
  const perPage = parseInt(query.per_page?.toString() || "10");
  const offset = (page - 1) * perPage;

  try {
    let whereClause = "";
    const params: any[] = [];

    if (search) {
      whereClause = `
        WHERE r.report_details LIKE ? 
        OR (u.first_name || ' ' || u.last_name) LIKE ? 
        OR (d.first_name || ' ' || d.last_name) LIKE ? 
        OR d.plate_number LIKE ?
        OR CAST(r.id AS TEXT) LIKE ?
      `;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam);
    }

    // Get total count for pagination
    const countResult = await db.prepare(
      `SELECT COUNT(*) as total FROM report r
       LEFT JOIN user u ON r.user_id = u.id
       LEFT JOIN driver d ON r.driver_id = d.id
       ${whereClause}`
    ).bind(...params).first();

    const total = countResult?.total || 0;

    // Get paginated results
    const results = await db.prepare(
      `SELECT r.id, r.user_id, r.trip_id, r.driver_id, r.report_details, r.status, r.date_created,
        u.first_name || ' ' || u.last_name AS user_name,
        d.first_name || ' ' || d.last_name AS driver_name,
        d.plate_number
      FROM report r
      LEFT JOIN user u ON r.user_id = u.id
      LEFT JOIN driver d ON r.driver_id = d.id
      ${whereClause}
      ORDER BY r.date_created DESC
      LIMIT ? OFFSET ?`
    ).bind(...params, perPage, offset).all();

    return {
      success: true,
      results: results.results || [],
      meta: {
        total,
        page,
        per_page: perPage,
        total_pages: Math.ceil(total / perPage)
      }
    };

  } catch (error: any) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: error.message || 'Failed to fetch reports' 
    });
  }
});
