// server/api/driver/search.get.ts
export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const search = getQuery(event).search || "";

  try {
    const result = await db
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
        LEFT JOIN toda ON driver.toda_id = toda.id
        WHERE driver.first_name LIKE ? OR driver.last_name LIKE ?
        `,
      )
      .bind(`%${search}%`, `%${search}%`)
      .all();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to search drivers",
    });
  }
});
