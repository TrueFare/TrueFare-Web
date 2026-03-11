import { z } from 'zod';

const DriverSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  contact_number: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  plate_number: z.string().min(1),
  franchise_number: z.coerce.number(),
  is_registered: z.boolean().default(false),
  profile_pic: z.string().optional().nullable(),
  toda_id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
  const db = useDb(event);
  requireRole(event, ['admin', 'super_admin']);
  
  const body = await validateBody(event, DriverSchema);

  try {
    const result = await db
      .prepare(
        `INSERT INTO driver (first_name, last_name, contact_number, email, plate_number, franchise_number, is_registered, profile_pic, toda_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        body.first_name,
        body.last_name,
        body.contact_number,
        body.email || null,
        body.plate_number,
        body.franchise_number,
        body.is_registered ? 1 : 0,
        body.profile_pic || null,
        body.toda_id
      )
      .run();

    setResponseStatus(event, 201);
    return {
      success: true,
      message: 'Driver created successfully',
      data: {
        id: result.meta.last_row_id,
        ...body,
        is_registered: !!body.is_registered,
      }
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to create driver');
  }
});
