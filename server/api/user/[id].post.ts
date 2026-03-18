export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  const allowedFields = ["first_name", "last_name", "contact_number", "email"];

  const updateFields: string[] = [];
  const values: any[] = [];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateFields.push(`${field} = ?`);

      values.push(body[field]);
    }
  }

  if (!updateFields.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "No fields to update",
    });
  }

  values.push(id);

  // Fetch old data for audit
  const oldUser = await db
    .prepare(`SELECT email FROM user WHERE id = ?`)
    .bind(id)
    .first();

  await db
    .prepare(
      `UPDATE user SET ${updateFields.join(
        ", ",
      )}, date_updated = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
    .bind(...values)
    .run();

  if (oldUser && body.email !== undefined) {
    await logAudit(event, 'UPDATE', 'user', id, {
      email: { old: (oldUser as any).email, new: body.email }
    });
  }

  const updated = await db
    .prepare("SELECT * FROM user WHERE id = ?")
    .bind(id)
    .first();

  return {
    success: true,
    data: updated,
  };
});
