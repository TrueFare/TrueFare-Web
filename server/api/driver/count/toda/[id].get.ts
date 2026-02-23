export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Toda ID is required",
    });
  }

  try {
    const result = await db
      .prepare("SELECT COUNT(*) AS count FROM driver WHERE toda_id = ?")
      .bind(id)
      .first();
    const count =
      result && (result.results?.[0]?.count ?? result[0]?.count ?? 0);
    return { count: Number(result?.count || 0) };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to count drivers for toda",
    });
  }
});
