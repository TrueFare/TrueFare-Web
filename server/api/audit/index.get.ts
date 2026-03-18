export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const { table_name, action, actor_role, search } = getQuery(event);

  try {
    let query = `
      SELECT 
        at.*,
        COALESCE(a.first_name || ' ' || a.last_name, sa.first_name || ' ' || sa.last_name) as actor_name
      FROM audit_trail at
      LEFT JOIN admin a ON at.actor_id = a.id AND at.actor_role = 'admin'
      LEFT JOIN super_admin sa ON at.actor_id = sa.id AND at.actor_role = 'super_admin'
      WHERE 1=1
    `;
    const params: any[] = [];

    if (table_name) {
      query += ` AND at.table_name = ?`;
      params.push(table_name);
    }

    if (action) {
      query += ` AND at.action = ?`;
      params.push(action);
    }

    if (actor_role) {
      query += ` AND at.actor_role = ?`;
      params.push(actor_role);
    }

    if (search) {
      query += ` AND (actor_name LIKE ? OR at.record_id LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY at.date_created DESC LIMIT 100`;

    const result = await db.prepare(query).bind(...params).all();

    return {
      activities: result.results.map((r: any) => ({
        ...r,
        changes: r.changes ? JSON.parse(r.changes) : null
      }))
    };

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch activity log",
    });
  }
});
