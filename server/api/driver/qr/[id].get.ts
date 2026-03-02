import { renderSVG } from 'uqr';

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.truefare_db;
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Driver ID is required'
    });
  }

  try {
    // Fetch driver details to get plate_number
    const driver = await db
      .prepare('SELECT id, plate_number FROM driver WHERE id = ?')
      .bind(id)
      .first();

    if (!driver) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Driver not found'
      });
    }

    // Prepare the data to encode: "id|plate_number"
    const dataToEncode = `${driver.id}|${driver.plate_number}`;

    // Generate QR code as SVG
    const svg = renderSVG(dataToEncode);

    // Set headers for SVG image
    setHeaders(event, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600'
    });

    return svg;
  } catch (error: any) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: error.message || 'Failed to generate QR code' 
    });
  }
});
