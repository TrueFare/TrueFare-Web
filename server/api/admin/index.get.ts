export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

  try {
    const result = await db
      .prepare(
        `
        SELECT
          id,
          first_name,
          last_name,
          email,
          toda_id,
          date_created,
          date_updated
        FROM admin
        ORDER BY date_created DESC
        `,
      )
      .all();

    return {
      success: true,
      data: result.results,
      meta: {
        total: result.results.length,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch admins",
    });
  }
});
