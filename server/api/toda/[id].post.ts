export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "TODA ID is required",
    });
  }

  const { name, password, barangay, city } = body;

  if (!name || !password || !barangay || !city) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required: name, password, barangay, city",
    });
  }

  try {
    const date_updated = new Date().toISOString();

    // Fetch old data for audit
    const oldToda = await db
      .prepare(`SELECT name, barangay, city FROM toda WHERE id = ?`)
      .bind(id)
      .first();

    await db
      .prepare(
        `UPDATE toda SET name = ?, password = ?, barangay = ?, city = ?, date_updated = ? WHERE id = ?`,
      )
      .bind(name, password, barangay, city, date_updated, id)
      .run();

    if (oldToda) {
      await logAudit(event, 'UPDATE', 'toda', id, {
        name: { old: (oldToda as any).name, new: name },
        barangay: { old: (oldToda as any).barangay, new: barangay },
        city: { old: (oldToda as any).city, new: city }
      });
    }

    // Fetch the updated toda
    const updated = await db
      .prepare(
        "SELECT id, name, password, barangay, city, date_created, date_updated FROM toda WHERE id = ?",
      )
      .bind(id)
      .first();

    return {
      success: true,
      message: "TODA updated successfully",
      data: updated,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to update TODA",
    });
  }
});
