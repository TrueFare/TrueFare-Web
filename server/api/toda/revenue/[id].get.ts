export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Toda ID is required",
    });
  }

  try {
    const result = await db.prepare(`
      SELECT 
        SUM(f.base_fare + CASE WHEN t.distance > f.base_km THEN (t.distance - f.base_km) * f.fare_per_km ELSE 0 END) as total
      FROM trip t
      JOIN driver d ON t.driver_id = d.id
      JOIN fare f ON t.fare_id = f.id
      WHERE d.toda_id = ?
    `).bind(id).first();

    return { total: Number(result?.total || 0) };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch TODA revenue",
    });
  }
});
