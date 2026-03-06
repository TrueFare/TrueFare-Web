export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Admin ID is required",
    });
  }

  try {
    const admin = await db
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
        WHERE id = ?
      `,
      )
      .bind(id)
      .first();

    if (!admin) {
      throw createError({
        statusCode: 404,
        message: "Admin not found",
      });
    }

    return {
      success: true,
      data: admin,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch admin",
    });
  }
});
