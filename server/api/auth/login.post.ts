export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const body = await readBody(event);

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
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
      setCookie(event, 'auth_session', JSON.stringify({ id: superAdmin.id, role: 'super_admin' }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });
      setCookie(event, 'auth_session_hint', superAdmin.id, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
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
      setCookie(event, 'auth_session', JSON.stringify({ id: admin.id, role: 'admin' }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      setCookie(event, 'auth_session_hint', admin.id, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
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
      setCookie(event, 'auth_session', JSON.stringify({ id: user.id, role: 'user' }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      setCookie(event, 'auth_session_hint', user.id, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      return user;
    }

    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    });
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to authenticate",
    });
  }
});
