// server/api/toda/count_admin/[id].get.ts

export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const id = getRouterParam(event, "id");

  try {
    const result = await db
      .prepare(
        `
        SELECT COUNT(*) AS count
        FROM admin
        WHERE toda_id = ?
      `,
      )
      .bind(id)
      .first();

    return { count: Number(result?.count || 0) };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to count TODA admins",
    });
  }
});
