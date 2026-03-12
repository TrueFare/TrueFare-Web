export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = event.context.params?.id;
  const body = await readBody(event);

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

  return { success: true };
});
