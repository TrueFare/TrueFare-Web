export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

  try {
    const result = await db
      .prepare(
        `
      SELECT 
        id,
        first_name,
        last_name,
        email,
        NULL as contact_number,
        date_created,
        date_updated,
        'super_admin' as role
      FROM super_admin

      UNION ALL

      SELECT 
        id,
        first_name,
        last_name,
        email,
        NULL as contact_number,
        date_created,
        date_updated,
        'admin' as role
      FROM admin

      UNION ALL

      SELECT 
        id,
        first_name,
        last_name,
        email,
        contact_number,
        date_created,
        date_updated,
        'user' as role
      FROM user
    `,
      )
      .run();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch accounts",
    });
  }
});
