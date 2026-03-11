export default defineEventHandler(async (event) => {
  const db = useDb(event);
  requireRole(event, ['admin', 'super_admin']);

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
        'super_admin' as role,
        NULL as toda_id
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
        'admin' as role,
        toda_id
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
        'user' as role,
        NULL as toda_id
      FROM user
    `,
      )
      .run();

    return result;
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch accounts");
  }
});
