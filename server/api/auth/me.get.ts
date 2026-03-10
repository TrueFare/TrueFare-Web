export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const sessionCookie = getCookie(event, 'auth_session');

  if (!sessionCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated",
    });
  }

  let sessionData: any;
  try {
    sessionData = JSON.parse(sessionCookie);
  } catch (e) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid session",
    });
  }

  const { id, role } = sessionData;

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
      deleteCookie(event, 'auth_session');
      throw createError({
        statusCode: 401,
        statusMessage: "User not found",
      });
    }

    return user;
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch session",
    });
  }
});
