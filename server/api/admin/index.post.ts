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

    const adminId = result.meta.last_row_id;

    // Log the audit
    await logAudit(event, 'CREATE', 'admin', adminId, {
      email: { old: null, new: email },
      toda_id: { old: null, new: toda_id }
    });

    return {
      success: true,
      message: "Admin created successfully",
      id: adminId,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
