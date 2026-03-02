export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  try {
    const result = await db
      .prepare("DELETE FROM user WHERE id = ?")
      .bind(id)
      .run();

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to delete user",
    });
  }
});
