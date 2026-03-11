export default defineNuxtPlugin(async () => {
  const { user, fetchUser } = useAuth();
  const sessionHint = useCookie('auth_session_hint');

  // If a session hint exists and the user state is not yet populated, 
  // perform an initial fetch on the server to ensure SSR has user data.
  if (sessionHint.value && !user.value) {
    try {
      await fetchUser();
    } catch (e) {
      // Fail silently, middleware will handle redirection if needed.
    }
  }
});