export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 8;
  const offset = (page - 1) * limit;

  try {
    const results = await db
      .prepare(
        `SELECT id, name, password, barangay, city, date_created, date_updated FROM toda ORDER BY date_created DESC LIMIT ? OFFSET ?`,
      )
      .bind(limit, offset)
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
