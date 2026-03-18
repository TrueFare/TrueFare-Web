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
    const totalResult = await db.prepare(`
      SELECT COUNT(*) AS count
      FROM report r
      JOIN driver d ON r.driver_id = d.id
      WHERE d.toda_id = ?
    `).bind(id).first();

    const pendingResult = await db.prepare(`
      SELECT COUNT(*) AS count
      FROM report r
      JOIN driver d ON r.driver_id = d.id
      WHERE d.toda_id = ? AND r.status = 0
    `).bind(id).first();

    return {
      total: Number(totalResult?.count || 0),
      pending: Number(pendingResult?.count || 0)
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to count reports for toda",
    });
  }
});
