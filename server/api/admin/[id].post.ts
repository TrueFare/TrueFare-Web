export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = event.context.params?.id;
  const body = await readBody(event);

  // Fetch old data for audit
  const oldAdmin = await db
    .prepare(`SELECT email, toda_id FROM admin WHERE id = ?`)
    .bind(id)
    .first();

  await db
    .prepare(
      `
    UPDATE admin
    SET first_name = ?, last_name = ?, email = ?, toda_id = ?, date_updated = datetime('now')
    WHERE id = ?
  `,
    )
    .bind(body.first_name, body.last_name, body.email, body.toda_id, id)
    .run();

  if (oldAdmin) {
    await logAudit(event, 'UPDATE', 'admin', id as string, {
      email: { old: (oldAdmin as any).email, new: body.email },
      toda_id: { old: (oldAdmin as any).toda_id, new: body.toda_id }
    });
  }

  return { success: true };
});
