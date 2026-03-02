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

    // Generate QR code as SVG with High Error Correction (H = 30%)
    let svg = renderSVG(dataToEncode, {
      ecc: 'H',
      border: 1
    });

    const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    if (viewBoxMatch) {
      const size = parseInt(viewBoxMatch[1]);
      const center = size / 2;
      const logoSize = size * 0.22;
      const innerSize = logoSize * 0.85;
      const offset = logoSize / 2;
      const innerOffset = innerSize / 2;
      const rounding = size * 0.03;

      // Fetch the image and convert to base64 to ensure it renders inside <img> tags
      const imageUrl = "https://avatars.githubusercontent.com/u/259327124?s=400&v=4";
      let base64Image = "";
      
      try {
        const imageBuffer = await $fetch<ArrayBuffer>(imageUrl, { responseType: 'arrayBuffer' });
        const base64String = Buffer.from(imageBuffer).toString('base64');
        base64Image = `data:image/png;base64,${base64String}`;
      } catch (e) {
        console.error("Failed to fetch logo for QR, falling back to colored square", e);
      }
      
      let logoContent = "";
      if (base64Image) {
        logoContent = `
          <clipPath id="roundedSquare">
            <rect x="${center - innerOffset}" y="${center - innerOffset}" width="${innerSize}" height="${innerSize}" rx="${rounding * 0.8}" ry="${rounding * 0.8}" />
          </clipPath>
          <image x="${center - innerOffset}" y="${center - innerOffset}" width="${innerSize}" height="${innerSize}" href="${base64Image}" clip-path="url(#roundedSquare)" />
        `;
      } else {
        logoContent = `
          <rect x="${center - innerOffset}" y="${center - innerOffset}" width="${innerSize}" height="${innerSize}" fill="#1d4ed8" rx="${rounding * 0.8}" ry="${rounding * 0.8}" />
          <text x="${center}" y="${center}" font-family="Arial, sans-serif" font-weight="900" font-size="${innerSize * 0.6}" fill="white" text-anchor="middle" dominant-baseline="central">T</text>
        `;
      }

      const overlay = `
        <rect x="${center - offset}" y="${center - offset}" width="${logoSize}" height="${logoSize}" fill="white" rx="${rounding}" ry="${rounding}" />
        ${logoContent}
      `;
      svg = svg.replace('</svg>', `${overlay}</svg>`);
    }

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
