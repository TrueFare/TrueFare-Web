export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const { range = "monthly" } = getQuery(event);

  try {
    let query = "";

    if (range === "weekly") {
      query = `
        SELECT
          strftime('%w', trip_start) as label,
          COUNT(*) as trip_count
        FROM trip
        WHERE trip_start >= date('now','-7 days')
        GROUP BY label
        ORDER BY label
      `;
    }

    if (range === "monthly") {
      query = `
        SELECT
          strftime('%m', trip_start) as label,
          COUNT(*) as trip_count
        FROM trip
        WHERE trip_start >= date('now','-6 months')
        GROUP BY label
        ORDER BY label
      `;
    }

    if (range === "yearly") {
      query = `
        SELECT
          strftime('%Y', trip_start) as label,
          COUNT(*) as trip_count
        FROM trip
        GROUP BY label
        ORDER BY label
      `;
    }

    const result = await db.prepare(query).all();

    return {
      labels: result.results.map((r: any) => r.label),
      data: result.results.map((r: any) => r.trip_count),
    };

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch fare trend",
    });
  }
});