export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

  try {
    const result = await db.prepare(`
      SELECT
        toda.id,
        toda.name,
        COUNT(driver.id) as driver_count
      FROM toda
      LEFT JOIN driver ON driver.toda_id = toda.id
      GROUP BY toda.id
      ORDER BY driver_count DESC
      LIMIT 5
    `).all();

    return result;

  } catch (error:any) {
    throw createError({
      statusCode:500,
      statusMessage:error.message
    })
  }
});