export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const todaId = getRouterParam(event, "id");

  if (!todaId) {
    throw createError({
      statusCode: 400,
      statusMessage: "TODA ID is required",
    });
  }

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
        WHERE toda_id = ?
        ORDER BY date_created DESC
        `
      )
      .bind(todaId)
      .all();

    return {
      success: true,
      data: result.results || [],
      meta: {
        total: result.results?.length || 0,
        toda_id: todaId,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch TODA admins",
    });
  }
});