export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const { range = "monthly" } = getQuery(event);

  try {
    // 1. Calculate Total Lifetime Cash Flow
    const totalLifetimeResult = await db.prepare(`
      SELECT 
        SUM(f.base_fare + CASE WHEN t.distance > f.base_km THEN (t.distance - f.base_km) * f.fare_per_km ELSE 0 END) as total
      FROM trip t
      JOIN fare f ON t.fare_id = f.id
    `).first();

    const totalLifetime = totalLifetimeResult?.total || 0;

    // 2. Calculate Revenue per TODA for the selected range
    let dateFilter = "";
    if (range === "monthly") {
      dateFilter = "WHERE t.trip_start >= date('now', 'start of month')";
    } else if (range === "yearly") {
      dateFilter = "WHERE t.trip_start >= date('now', 'start of year')";
    }

    const chartDataResult = await db.prepare(`
      SELECT
        todo.id,
        todo.name as label,
        SUM(f.base_fare + CASE WHEN t.distance > f.base_km THEN (t.distance - f.base_km) * f.fare_per_km ELSE 0 END) as revenue   
      FROM trip t
      JOIN driver d ON t.driver_id = d.id
      JOIN toda todo ON d.toda_id = todo.id
      JOIN fare f ON t.fare_id = f.id
      ${dateFilter}
      GROUP BY todo.id
      ORDER BY revenue DESC
    `).all();

    return {
      totalLifetime,
      labels: chartDataResult.results.map((r: any) => r.label),
      data: chartDataResult.results.map((r: any) => r.revenue),
      ids: chartDataResult.results.map((r: any) => r.id),
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch TODA revenue",
    });
  }
});