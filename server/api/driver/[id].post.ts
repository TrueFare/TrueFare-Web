export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Driver ID is required",
    });
  }

  const allowedFields = [
    "first_name",
    "last_name",
    "contact_number",
    "email",
    "plate_number",
    "franchise_number",
    "is_registered",
    "profile_pic",
    "toda_id",
  ];

  const updateFields: string[] = [];
  const values: any[] = [];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateFields.push(`${field} = ?`);

      values.push(
        field === "is_registered" ? (body[field] ? 1 : 0) : body[field],
      );
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
  const oldDriver = await db
    .prepare(`SELECT plate_number, franchise_number, is_registered, toda_id FROM driver WHERE id = ?`)
    .bind(id)
    .first();

  await db
    .prepare(
      `UPDATE driver SET ${updateFields.join(
        ", ",
      )}, date_updated = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
    .bind(...values)
    .run();

  if (oldDriver) {
    const changes: any = {};
    const fieldsToLog = ["plate_number", "franchise_number", "is_registered", "toda_id"];
    let hasImportantChanges = false;

    for (const field of fieldsToLog) {
      if (body[field] !== undefined) {
        const oldValue = (oldDriver as any)[field];
        let newValue = body[field];
        if (field === 'is_registered') {
          newValue = newValue ? 1 : 0;
        }
        
        if (oldValue !== newValue) {
          changes[field] = { old: oldValue, new: newValue };
          hasImportantChanges = true;
        }
      }
    }

    if (hasImportantChanges) {
      await logAudit(event, 'UPDATE', 'driver', id, changes);
    }
  }

  const updated = await db
    .prepare("SELECT * FROM driver WHERE id = ?")
    .bind(id)
    .first();

  return {
    success: true,
    data: updated,
  };
});
