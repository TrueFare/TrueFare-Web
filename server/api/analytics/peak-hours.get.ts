export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

  try {
    // We want to ensure all 24 hours are represented
    // We can use a recursive CTE or just post-process in JS.
    // Let's do a simple query and post-process.
    const result = await db.prepare(`
      SELECT 
        strftime('%H', trip_start) as hour,
        COUNT(*) as count
      FROM trip
      GROUP BY hour
      ORDER BY hour ASC
    `).all();

    const hourlyData = Array(24).fill(0);
    const labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    if (result.results) {
      result.results.forEach((row: any) => {
        const hourIndex = parseInt(row.hour);
        if (hourIndex >= 0 && hourIndex < 24) {
          hourlyData[hourIndex] = row.count;
        }
      });
    }

    return {
      labels,
      data: hourlyData
    };

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});
