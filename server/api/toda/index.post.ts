export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const body = await readBody(event);

  const requiredFields = ["name", "password", "barangay", "city"];
  const missingFields = requiredFields.filter(
    (field) =>
      body[field] === undefined || body[field] === null || body[field] === "",
  );

  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  const { name, password, barangay, city, date_updated } = body;

  try {
    const date_created = new Date().toISOString();

    const result = await db
      .prepare(
        `
    INSERT INTO toda (name, password, barangay, city, date_created, date_updated)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
      )
      .bind(name, password, barangay, city, date_created, date_updated || null)
      .run();

    setResponseStatus(event, 201);
    return {
      success: true,
      message: "TODA created successfully",
      data: {
        id: result.meta.last_row_id,
        name,
        barangay,
        city,
        date_created,
        date_updated,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message || "Failed to create TODA",
    });
  }
});
