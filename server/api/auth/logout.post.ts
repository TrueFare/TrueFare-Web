export default defineEventHandler((event) => {
  clearAuthSession(event);
  return { success: true };
});
