export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser, hasSessionHint } = useAuth();
  
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

  // Use the session hint cookie for synchronous checks during SSR
  const hint = useCookie('auth_session_hint');

  // Redirection for unauthenticated users
  // If we have no user AND no hint, we are definitely logged out.
  if (!user.value && !hint.value && !isPublicRoute) {
    return navigateTo('/login');
  }

  // If we are on the server and have a hint but no user yet, 
  // we let the request continue to the protected page to avoid the flash.
  // The client will complete the auth fetch and redirect if necessary.
  if (import.meta.server && !user.value && hint.value) {
    return;
  }

  // Redirection for already logged-in users trying to access login
  if ((user.value || hint.value) && to.path === '/login') {
    if (user.value?.role === 'super_admin') {
      return navigateTo('/super-admin');
    } else if (user.value?.role === 'admin') {
      return navigateTo('/admin');
    }
    // If we only have the hint, we don't know the role yet, so maybe redirect to home
    return navigateTo('/');
  }

  // Protection for super-admin specific routes
  if (to.path.startsWith('/super-admin')) {
    if (user.value && user.value.role !== 'super_admin') {
      return navigateTo('/');
    }
    if (!user.value && !hint.value) {
      return navigateTo('/login');
    }
  }

  // Protection for admin specific routes
  if (to.path.startsWith('/admin')) {
    if (user.value && !['admin', 'super_admin'].includes(user.value.role)) {
      return navigateTo('/');
    }
    if (!user.value && !hint.value) {
      return navigateTo('/login');
    }
  }
});
