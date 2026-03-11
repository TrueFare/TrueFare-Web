import type { H3Event } from 'h3';

export const useDb = (event: H3Event) => {
  const db = event.context.cloudflare?.env?.truefare_db;
  
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database connection not available'
    });
  }
  
  return db;
};
