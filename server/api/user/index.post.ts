export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const body = await readBody(event);

  // Validate required fields
  const requiredFields = ['first_name', 'last_name', 'email', 'password'];
  const missingFields = requiredFields.filter(field => !body[field]);

  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  const { first_name, last_name, email, contact_number, password } = body;

  try {
    const result = await db
      .prepare(
        `INSERT INTO user (first_name, last_name, email, contact_number, password) 
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(first_name, last_name, email, contact_number || null, password)
      .run();

    setResponseStatus(event, 201);
    return {
      success: true,
      message: "User created successfully",
      data: {
        id: result.meta.last_row_id,
        first_name,
        last_name,
        email,
        contact_number: contact_number || null
      }
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message || "Failed to create user"
    });
  }
});
