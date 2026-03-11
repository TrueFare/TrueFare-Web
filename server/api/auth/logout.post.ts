export default defineEventHandler((event) => {
  clearSession(event);
  return { success: true };
});
