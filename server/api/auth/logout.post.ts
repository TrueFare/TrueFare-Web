export default defineEventHandler((event) => {
  deleteCookie(event, 'auth_session', { path: '/' });
  return { success: true };
});
