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
    // last 7 days including today
    const result = await db
      .prepare(
        `SELECT COUNT(*) AS count FROM trip t JOIN driver d ON t.driver_id = d.id WHERE d.toda_id = ? AND date(t.trip_start) BETWEEN date('now','-6 days') AND date('now')`,
      )
      .bind(id)
      .first();

    const count =
      result && (result.results?.[0]?.count ?? result[0]?.count ?? 0);
    return { count: Number(count) };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to count weekly trips for toda",
    });
  }
});
