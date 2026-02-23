export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "TODA ID is required",
    });
  }

  try {
    const result = await db
      .prepare(
        "SELECT id, name, password, barangay, city, date_created, date_updated FROM toda WHERE id = ?",
      )
      .bind(id)
      .run();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch toda",
    });
  }
});
