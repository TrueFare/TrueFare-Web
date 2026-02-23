export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

  try {
    const result = await db
      .prepare(
        `SELECT id, name, password, barangay, city, date_created, date_updated FROM toda`,
      )
      .all();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch todas",
    });
  }
});
