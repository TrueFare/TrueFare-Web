export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth();
  
  // Try fetching user if not already available
  if (!user.value) {
    try {
      await fetchUser();
    } catch (e) {
      // Not logged in or fetch failed
    }
  }

  const publicRoutes = ['/login', '/'];
  const isPublicRoute = publicRoutes.includes(to.path);

  // Use hints for synchronous checks during SSR
  const hintId = useCookie('auth_session_hint');
  const hintRole = useCookie('auth_role_hint');

  // 1. Redirection for unauthenticated users
  if (!user.value && !hintId.value && !isPublicRoute) {
    return navigateTo('/login');
  }

  // 2. Redirection for already logged-in users trying to access login page
  if ((user.value || hintId.value) && to.path === '/login') {
    const role = user.value?.role || hintRole.value;
    if (role === 'super_admin') return navigateTo('/super-admin');
    if (role === 'admin') return navigateTo('/admin');
    return navigateTo('/');
  }

  // 3. Authorization protection
  const currentRole = user.value?.role || hintRole.value;

  // Protection for super-admin specific routes
  if (to.path.startsWith('/super-admin') && currentRole !== 'super_admin') {
    return navigateTo('/');
  }

  // Protection for admin specific routes
  if (to.path.startsWith('/admin') && !['admin', 'super_admin'].includes(currentRole || '')) {
    return navigateTo('/');
  }
});
