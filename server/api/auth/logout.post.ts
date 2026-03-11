export default defineEventHandler((event) => {
  deleteCookie(event, 'auth_session', { path: '/' });
  deleteCookie(event, 'auth_session_hint', { path: '/' });
  return { success: true };
});
