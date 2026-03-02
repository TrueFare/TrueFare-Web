export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const search = getQuery(event).search || "";

  try {
    const result = await db
      .prepare(
        `
        SELECT
          user.id,
          user.first_name,
          user.last_name,
          user.email,
          user.contact_number,
          user.date_created,
          user.date_updated
        FROM user
        WHERE user.first_name LIKE ? OR user.last_name LIKE ?
        `,
      )
      .bind(`%${search}%`, `%${search}%`)
      .all();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to search USER",
    });
  }
});
