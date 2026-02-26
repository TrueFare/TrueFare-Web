export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Driver ID is required'
    });
  }

  const allowedFields = [
    'first_name',
    'last_name',
    'contact_number',
    'email',
    'plate_number',
    'franchise_number',
    'is_registered',
    'profile_pic',
    'toda_id'
  ];

  const updateFields: string[] = [];
  const values: any[] = [];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateFields.push(`${field} = ?`);
      if (field === 'is_registered') {
        values.push(body[field] ? 1 : 0);
      } else {
        values.push(body[field]);
      }
    }
  }

  if (updateFields.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one field is required to update'
    });
  }

  values.push(id);

  try {
    await db
      .prepare(`UPDATE driver SET ${updateFields.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run();

    const updated = await db
      .prepare(
        'SELECT id, first_name, last_name, contact_number, email, plate_number, franchise_number, is_registered, profile_pic, toda_id, date_created, date_updated FROM driver WHERE id = ?'
      )
      .bind(id)
      .run();

    return {
      success: true,
      message: 'Driver updated successfully',
      data: updated
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update driver'
    });
  }
});