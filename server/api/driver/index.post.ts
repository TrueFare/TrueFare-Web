export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const body = await readBody(event);

  const requiredFields = ['first_name', 'last_name', 'contact_number', 'plate_number', 'franchise_number', 'is_registered', 'toda_id'];
  const missingFields = requiredFields.filter(field => body[field] === undefined || body[field] === null || body[field] === '');

  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  const {
    first_name,
    last_name,
    contact_number,
    email,
    plate_number,
    franchise_number,
    is_registered,
    profile_pic,
    toda_id
  } = body;

  try {
    const result = await db
      .prepare(
        `INSERT INTO driver (first_name, last_name, contact_number, email, plate_number, franchise_number, is_registered, profile_pic, toda_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        first_name,
        last_name,
        contact_number,
        email || null,
        plate_number,
        franchise_number,
        is_registered ? 1 : 0,
        profile_pic || null,
        toda_id
      )
      .run();

    setResponseStatus(event, 201);
    return {
      success: true,
      message: 'Driver created successfully',
      data: {
        id: result.meta.last_row_id,
        first_name,
        last_name,
        contact_number,
        email: email || null,
        plate_number,
        franchise_number,
        is_registered: !!is_registered,
        profile_pic: profile_pic || null,
        toda_id
      }
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Failed to create driver'
    });
  }
});
