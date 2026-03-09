export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const body = await readBody(event);

  const requiredFields = [
    "first_name",
    "last_name",
    "email",
    "password",
    "toda_id",
  ];

  const missing = requiredFields.filter((f) => !body[f]);

  if (missing.length) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing fields: ${missing.join(", ")}`,
    });
  }

  const { first_name, last_name, email, password, toda_id } = body;

  try {
    const result = await db
      .prepare(
        `
      INSERT INTO admin (
        first_name,
        last_name,
        email,
        password,
        toda_id,
        date_created
      )
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `,
      )
      .bind(first_name, last_name, email, password, toda_id)
      .run();

    return {
      success: true,
      message: "Admin created successfully",
      id: result.meta.last_row_id,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
