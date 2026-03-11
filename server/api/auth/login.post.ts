export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const body = await readBody(event);

  if (!body.email || !body.password) {
    throw createApiError(400, "Email and password are required");
  }

  const { email, password } = body;

  try {
    // 1. Check Super Admin
    const superAdmin = await db
      .prepare(
        "SELECT id, first_name, last_name, email, 'super_admin' as role FROM super_admin WHERE email = ? AND password = ?"
      )
      .bind(email, password)
      .first();

    if (superAdmin) {
      setSession(event, { id: superAdmin.id, role: 'super_admin' });
      return superAdmin;
    }

    // 2. Check Admin
    const admin = await db
      .prepare(
        "SELECT id, first_name, last_name, email, 'admin' as role, toda_id FROM admin WHERE email = ? AND password = ?"
      )
      .bind(email, password)
      .first();

    if (admin) {
      setSession(event, { id: admin.id, role: 'admin' });
      return admin;
    }

    // 3. Check User
    const user = await db
      .prepare(
        "SELECT id, first_name, last_name, email, 'user' as role FROM user WHERE email = ? AND password = ?"
      )
      .bind(email, password)
      .first();

    if (user) {
      setSession(event, { id: user.id, role: 'user' });
      return user;
    }

    throw createApiError(401, "Invalid email or password");
  } catch (error: any) {
    return handleApiError(error, "Failed to authenticate");
  }
});
