export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

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
        LEFT JOIN toda
        ON driver.toda_id = toda.id
      `,
      )
      .run();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch drivers",
    });
  }
});
