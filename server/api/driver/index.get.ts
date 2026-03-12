export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 6;
  const offset = (page - 1) * limit;

  try {
    const results = await db
      .prepare(
        `
        SELECT
          driver.id,
          driver.first_name,
          driver.last_name,
          driver.contact_number,
          driver.email,
          driver.plate_number,
          driver.franchise_number,
          driver.is_registered,
          driver.profile_pic,
          driver.toda_id,
          toda.name AS toda_name,
          driver.date_created,
          driver.date_updated
        FROM driver
        LEFT JOIN toda
        ON driver.toda_id = toda.id
        ORDER BY driver.date_created DESC
        LIMIT ? OFFSET ?
      `,
      )
      .bind(limit, offset)
      .all();

    const totalCount = await db
      .prepare("SELECT COUNT(*) as count FROM driver")
      .first("count");

    return {
      results: results.results,
      total: totalCount,
      page,
      limit
    };
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch drivers");
  }
});
