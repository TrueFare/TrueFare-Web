import { H3Error } from 'h3';

export const createApiError = (statusCode: number, message: string, data?: any) => {
  return createError({
    statusCode,
    statusMessage: message,
    data,
  });
};

export const handleApiError = (error: any, defaultMessage = 'Internal Server Error') => {
  if (error instanceof H3Error) {
    throw error;
  }
  
  console.error('API Error:', error);
  
  throw createError({
    statusCode: error.statusCode || 500,
    statusMessage: error.statusMessage || error.message || defaultMessage,
  });
};
