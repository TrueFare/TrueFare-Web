export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;

  try {
    const result = await db
      .prepare('SELECT id, first_name, last_name, email, contact_number, date_created, date_updated FROM user')
      .run();

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch users'
    });
  }
});
