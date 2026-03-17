export default defineEventHandler(async (event) => {
  const db = useDb(event);

  try {
    const userCount = await db
      .prepare("SELECT COUNT(*) as count FROM user")
      .first("count") || 0;

    const driverCount = await db
      .prepare("SELECT COUNT(*) as count FROM driver")
      .first("count") || 0;

    const adminCount = await db
      .prepare("SELECT COUNT(*) as count FROM admin")
      .first("count") || 0;

    const superAdminCount = await db
      .prepare("SELECT COUNT(*) as count FROM super_admin")
      .first("count") || 0;

    return {
      users: userCount,
      drivers: driverCount,
      admins: adminCount,
      superAdmins: superAdminCount,
    };
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch overall user analytics");
  }
});
