export default defineEventHandler(async (event) => {
  const db = useDb(event);
  requireRole(event, ['admin', 'super_admin']);

  try {
    const result = await db
      .prepare('SELECT id, base_km, base_fare, fare_per_km, date_created FROM fare')
      .run();

    return result;
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch fares');
  }
});
