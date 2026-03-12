export default defineEventHandler(async (event) => {
  const db = useDb(event);
  requireAuthRole(event, ['admin', 'super_admin']);

  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 5;
  const offset = (page - 1) * limit;

  try {
    const results = await db
      .prepare('SELECT id, base_km, base_fare, fare_per_km, date_created FROM fare ORDER BY date_created DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all();

    const totalCount = await db
      .prepare("SELECT COUNT(*) as count FROM fare")
      .first("count");

    return {
      results: results.results,
      total: totalCount,
      page,
      limit
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch fares');
  }
});
