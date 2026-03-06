export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = event.context.params?.id;
  const body = await readBody(event);

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

  return { success: true };
});
