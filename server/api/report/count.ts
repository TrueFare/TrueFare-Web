export default defineEventHandler(async (event) => {
  const db = useDb(event);
  try {
    const result = await db.prepare("SELECT COUNT(*) as count FROM report").first("count");
    return { count: result || 0 };
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch report count");
  }
});
