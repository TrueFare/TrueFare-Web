export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const session = requireSession(event);

  const { id, role } = session;

  try {
    let user;
    if (role === 'super_admin') {
      user = await db
        .prepare("SELECT id, first_name, last_name, email, 'super_admin' as role FROM super_admin WHERE id = ?")
        .bind(id)
        .first();
    } else if (role === 'admin') {
      user = await db
        .prepare("SELECT id, first_name, last_name, email, 'admin' as role, toda_id FROM admin WHERE id = ?")
        .bind(id)
        .first();
    } else if (role === 'user') {
      user = await db
        .prepare("SELECT id, first_name, last_name, email, 'user' as role FROM user WHERE id = ?")
        .bind(id)
        .first();
    }

    if (!user) {
      clearSession(event);
      throw createApiError(401, "User not found");
    }

    return user;
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch session");
  }
});
