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

  await db
    .prepare(
      `UPDATE user SET ${updateFields.join(
        ", ",
      )}, date_updated = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
    .bind(...values)
    .run();

  const updated = await db
    .prepare("SELECT * FROM user WHERE id = ?")
    .bind(id)
    .first();

  return {
    success: true,
    data: updated,
  };
});
