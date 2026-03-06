export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const search = getQuery(event).search || "";

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
        WHERE super_admin.first_name LIKE ? OR super_admin.last_name LIKE ? OR (super_admin.first_name || ' ' || super_admin.last_name) LIKE ?

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
        WHERE admin.first_name LIKE ? OR admin.last_name LIKE ? OR (admin.first_name || ' ' || admin.last_name) LIKE ?

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
        WHERE user.first_name LIKE ? OR user.last_name LIKE ? OR (user.first_name || ' ' || user.last_name) LIKE ?
        `,
      )
      .bind(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      )
      .all();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to search USER",
    });
  }
});
