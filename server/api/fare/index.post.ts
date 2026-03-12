import { z } from 'zod';

const FareSchema = z.object({
  base_km: z.coerce.number().positive(),
  base_fare: z.coerce.number().positive(),
  fare_per_km: z.coerce.number().nonnegative(),
});

export default defineEventHandler(async (event) => {
  const db = useDb(event);
  requireAuthRole(event, ['super_admin']);
  
  const body = await validateBody(event, FareSchema);

  try {
    const result = await db
      .prepare('INSERT INTO fare (base_km, base_fare, fare_per_km) VALUES (?, ?, ?)')
      .bind(body.base_km, body.base_fare, body.fare_per_km)
      .run();

    setResponseStatus(event, 201);
    return {
      success: true,
      message: 'Fare created',
      data: {
        id: result.meta.last_row_id,
        ...body
      }
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to create fare');
  }
});
