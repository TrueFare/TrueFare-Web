// server/api/driver/search.get.ts
export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const search = getQuery(event).search || "";

  try {
    const result = await db
      .prepare(
        `
        SELECT
          toda.id,
          toda.name,
          toda.barangay,
          toda.city,
          toda.date_created,
          toda.date_updated
        FROM toda
        WHERE toda.name LIKE ? OR toda.barangay LIKE ?
        `,
      )
      .bind(`%${search}%`, `%${search}%`)
      .all();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to search TODA",
    });
  }
});
