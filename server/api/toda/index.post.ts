import { z } from 'zod';

const TodaSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(6),
  barangay: z.string().min(1),
  city: z.string().min(1),
  date_updated: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const db = useDb(event);
  requireRole(event, ['super_admin']);
  
  const body = await validateBody(event, TodaSchema);

  try {
    const date_created = new Date().toISOString();

    const result = await db
      .prepare(
        `
    INSERT INTO toda (name, password, barangay, city, date_created, date_updated)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
      )
      .bind(body.name, body.password, body.barangay, body.city, date_created, body.date_updated || null)
      .run();

    setResponseStatus(event, 201);
    return {
      success: true,
      message: "TODA created successfully",
      data: {
        id: result.meta.last_row_id,
        name: body.name,
        barangay: body.barangay,
        city: body.city,
        date_created,
        date_updated: body.date_updated,
      },
    };
  } catch (error: any) {
    return handleApiError(error, "Failed to create TODA");
  }
});
