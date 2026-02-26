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
    const result = await db
      .prepare('SELECT profile_pic FROM driver WHERE id = ?')
      .bind(id)
      .first();

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Driver not found'
      });
    }

    if (!result.profile_pic) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Profile picture not found'
      });
    }

    // The profile_pic is stored as Base64 encoded string
    // Decode it and return as binary blob with appropriate headers
    const base64Data = result.profile_pic as string;
    
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    // Decode base64 to binary
    const binaryData = Buffer.from(base64Image, 'base64');
    
    // Set appropriate content type headers
    setHeader(event, 'Content-Type', 'image/jpeg');
    setHeader(event, 'Content-Length', binaryData.length);
    setHeader(event, 'Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    return binaryData;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch driver picture'
    });
  }
});

