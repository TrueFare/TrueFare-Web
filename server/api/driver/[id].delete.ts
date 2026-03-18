export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Driver ID is required",
    });
  }

  try {
    const result = await db
      .prepare("DELETE FROM driver WHERE id = ?")
      .bind(id)
      .run();

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Driver not found",
      });
    }

    await logAudit(event, 'DELETE', 'driver', id);

    return {
      success: true,
      message: "Driver deleted successfully",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to delete driver",
    });
  }
});
