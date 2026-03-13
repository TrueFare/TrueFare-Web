export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const { range = "monthly", toda_id } = getQuery(event);

  if (!toda_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "TODA ID is required",
    });
  }

  try {
    let dateFilter = "";
    if (range === "daily") {
      dateFilter = "AND t.trip_start >= date('now')";
    } else if (range === "weekly") {
      dateFilter = "AND t.trip_start >= date('now', '-7 days')";
    } else if (range === "monthly") {
      dateFilter = "AND t.trip_start >= date('now', 'start of month')";
    }

    const query = `
      SELECT 
        d.first_name || ' ' || d.last_name as label,
        SUM(f.base_fare + CASE WHEN t.distance > f.base_km THEN (t.distance - f.base_km) * f.fare_per_km ELSE 0 END) as revenue
      FROM trip t
      JOIN driver d ON t.driver_id = d.id
      JOIN fare f ON t.fare_id = f.id
      WHERE d.toda_id = ? ${dateFilter}
      GROUP BY d.id
      ORDER BY revenue DESC
      LIMIT 10
    `;

    const result = await db.prepare(query).bind(toda_id).all();

    return {
      labels: result.results.map((r: any) => r.label),
      data: result.results.map((r: any) => r.revenue),
    };

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch top drivers",
    });
  }
});