export default defineEventHandler(async (event) => {
  const db = useDb(event);
  requireAuthRole(event, ['admin', 'super_admin']);
  
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 6;
  const offset = (page - 1) * limit;

  try {
    const results = await db
      .prepare(
        `
      SELECT 
        id,
        first_name,
        last_name,
        email,
        NULL as contact_number,
        date_created,
        date_updated,
        'super_admin' as role,
        NULL as toda_id
      FROM super_admin

      UNION ALL

      SELECT 
        id,
        first_name,
        last_name,
        email,
        NULL as contact_number,
        date_created,
        date_updated,
        'admin' as role,
        toda_id
      FROM admin

      UNION ALL

      SELECT 
        id,
        first_name,
        last_name,
        email,
        contact_number,
        date_created,
        date_updated,
        'user' as role,
        NULL as toda_id
      FROM user
      ORDER BY date_created DESC
      LIMIT ? OFFSET ?
    `,
      )
      .bind(limit, offset)
      .all();

    const totalCount = await db
      .prepare(`
        SELECT (
          SELECT COUNT(*) FROM super_admin
        ) + (
          SELECT COUNT(*) FROM admin
        ) + (
          SELECT COUNT(*) FROM user
        ) as count
      `)
      .first("count");

    return {
      results: results.results,
      total: totalCount,
      page,
      limit
    };
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch accounts");
  }
});
