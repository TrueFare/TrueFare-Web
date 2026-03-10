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

  // Redirection for unauthenticated users
  if (!user.value && !isPublicRoute) {
    return navigateTo('/login');
  }

  // Redirection for already logged-in users trying to access login
  if (user.value && to.path === '/login') {
    if (user.value.role === 'super_admin') {
      return navigateTo('/super-admin/dashboard');
    } else if (user.value.role === 'admin') {
      return navigateTo('/admin');
    }
    return navigateTo('/');
  }

  // Protection for super-admin specific routes
  if (to.path.startsWith('/super-admin') && user.value?.role !== 'super_admin') {
    return navigateTo('/');
  }

  // Protection for admin specific routes
  if (to.path.startsWith('/admin') && !['admin', 'super_admin'].includes(user.value?.role || '')) {
    return navigateTo('/');
  }
});
