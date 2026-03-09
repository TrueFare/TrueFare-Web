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
    // First check if the toda exists
    const existing = await db
      .prepare("SELECT id, name FROM toda WHERE id = ?")
      .bind(id)
      .first();

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "TODA not found",
      });
    }

    // Delete the toda
    const result = await db
      .prepare("DELETE FROM toda WHERE id = ?")
      .bind(id)
      .run();

    if (result.changes === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to delete TODA",
      });
    }

    return {
      success: true,
      message: `TODA "${existing.name}" deleted successfully`,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to delete TODA",
    });
  }
});
