export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limitQuery = query.limit as string;
  const limit = limitQuery === 'all' ? -1 : (parseInt(limitQuery) || 8);
  const offset = limit === -1 ? 0 : (page - 1) * limit;

  try {
    let queryStr = `SELECT id, name, password, barangay, city, date_created, date_updated FROM toda ORDER BY date_created DESC`;
    let params: any[] = [];
    
    if (limit !== -1) {
      queryStr += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }

    const results = await db
      .prepare(queryStr)
      .bind(...params)
      .all();

    const totalCount = await db
      .prepare("SELECT COUNT(*) as count FROM toda")
      .first("count");

    return {
      results: results.results,
      total: totalCount,
      page,
      limit
    };
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch todas");
  }
});
