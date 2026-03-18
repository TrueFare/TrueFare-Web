export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = event.context.params?.id;
  const body = await readBody(event);

  // Fetch old data for audit
  const oldSA = await db
    .prepare(`SELECT email FROM super_admin WHERE id = ?`)
    .bind(id)
    .first();

  await db
    .prepare(
      `
    UPDATE super_admin
    SET first_name = ?, last_name = ?, email = ?, date_updated = datetime('now')
    WHERE id = ?
  `,
    )
    .bind(body.first_name, body.last_name, body.email, id)
    .run();

  if (oldSA) {
    await logAudit(event, 'UPDATE', 'super_admin', id as string, {
      email: { old: (oldSA as any).email, new: body.email }
    });
  }

  return { success: true };
});
