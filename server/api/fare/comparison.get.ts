export default defineEventHandler(async (event) => {
  const db = useDb(event);
  requireAuthRole(event, ['admin', 'super_admin']);

  try {
    const results = await db
      .prepare('SELECT id, base_km, base_fare, fare_per_km, date_created FROM fare ORDER BY date_created DESC LIMIT 2')
      .all();

    const current = results.results[0] || null;
    const previous = results.results[1] || null;

    return {
      current,
      previous
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch fare comparison');
  }
});