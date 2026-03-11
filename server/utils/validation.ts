import { z, ZodSchema } from 'zod';
import type { H3Event } from 'h3';

export const validateBody = async <T>(event: H3Event, schema: ZodSchema<T>): Promise<T> => {
  const body = await readBody(event);
  const result = schema.safeParse(body);
  
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.format(),
    });
  }
  
  return result.data;
};

export const validateQuery = <T>(event: H3Event, schema: ZodSchema<T>): T => {
  const query = getQuery(event);
  const result = schema.safeParse(query);
  
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.format(),
    });
  }
  
  return result.data;
};
