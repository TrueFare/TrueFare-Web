export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Toda ID is required",
    });
  }

  try {
    const result = await db
      .prepare(
        `SELECT COUNT(*) AS count FROM trip t JOIN driver d ON t.driver_id = d.id WHERE d.toda_id = ?`,
      )
      .bind(id)
      .first();

    return { count: Number(result?.count || 0) };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to count all-time trips for toda",
    });
  }
});
