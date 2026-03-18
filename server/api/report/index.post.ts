export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const body = await readBody(event);

  // If ID is provided, it's an update (specifically for status)
  if (body.id) {
    const id = Number(body.id);
    const status = Number(body.status);

    try {
      // Get old status for audit logging
      const oldReport = await db
        .prepare(`SELECT status FROM report WHERE id = ?`)
        .bind(id)
        .first();

      await db
        .prepare(`UPDATE report SET status = ? WHERE id = ?`)
        .bind(status, id)
        .run();

      // Log the audit
      if (oldReport) {
        await logAudit(event, 'UPDATE', 'report', id, {
          status: { old: (oldReport as any).status, new: status }
        });
      }

      return {
        success: true,
        message: 'Report status updated',
        data: { id, status }
      };
    } catch (error: any) {
      throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to update report status' });
    }
  }

  // Create new report
  const required = ['user_id', 'trip_id', 'driver_id', 'report_details'];
  const missing = required.filter((k) => body[k] === undefined || body[k] === null || body[k] === '');
  if (missing.length > 0) {
    throw createError({ statusCode: 400, statusMessage: `Missing required fields: ${missing.join(', ')}` });
  }

  const user_id = Number(body.user_id);
  const trip_id = Number(body.trip_id);
  const driver_id = Number(body.driver_id);
  const report_details = String(body.report_details);
  const status = body.status === undefined ? 0 : Number(body.status);

  try {
    const result = await db
      .prepare(`INSERT INTO report (user_id, trip_id, driver_id, report_details, status) VALUES (?, ?, ?, ?, ?)`)
      .bind(user_id, trip_id, driver_id, report_details, status)
      .run();

    const reportId = result.meta.last_row_id;

    // Log the audit
    await logAudit(event, 'CREATE', 'report', reportId, {
      status: { old: null, new: status }
    });

    setResponseStatus(event, 201);
    return {
      success: true,
      message: 'Report created',
      data: { id: reportId, user_id, trip_id, driver_id, report_details, status }
    };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to create report' });
  }
});
