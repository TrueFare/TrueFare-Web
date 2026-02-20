export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

  try {
    const result = await db
      .prepare(
        `SELECT id, first_name, last_name, contact_number, email, plate_number, franchise_number, is_registered, profile_pic, toda_id, date_created, date_updated FROM driver`
      )
      .run();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch drivers'
    });
  }
});
