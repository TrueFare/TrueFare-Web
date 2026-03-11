export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  toda_id?: string;
}

export const useAuth = () => {
  const user = useState<User | null>('user', () => null);
  const loading = useState<boolean>('auth-loading', () => false);
  const sessionHint = useCookie('auth_session_hint');

  const fetchUser = async () => {
    // If no session hint, we can skip fetching on server to avoid unnecessary work
    // but only if we are absolutely sure the cookie is the source of truth.
    // For now, let's keep the fetch but make it safer.
    
    loading.value = true;
    try {
      const headers = useRequestHeaders(['cookie']);
      const data = await $fetch<User>('/api/auth/me', { headers });
      user.value = data;
      if (data) sessionHint.value = data.id;
    } catch (e: any) {
      user.value = null;
      // If it's a 401, we definitely don't have a session
      if (e.statusCode === 401) {
        sessionHint.value = null;
      }
      // If it's another error (500, fetch failure on server), 
      // we keep the hint to avoid premature redirect on SSR
    } finally {
      loading.value = false;
    }
  };

  const login = async (credentials: any) => {
    loading.value = true;
    try {
      const response = await $fetch<User>('/api/auth/login', {
        method: 'POST',
        body: credentials
      });
      user.value = response;
      if (response) sessionHint.value = response.id;
      
      // Redirect based on role
      if (user.value.role === 'super_admin') {
        navigateTo('/super-admin');
      } else if (user.value.role === 'admin') {
        navigateTo('/admin');
      } else {
        navigateTo('/');
      }
    } catch (e: any) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await $fetch('/api/auth/logout', { method: 'POST' });
      user.value = null;
      sessionHint.value = null;
      navigateTo('/login');
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    fetchUser,
    login,
    logout,
    hasSessionHint: computed(() => !!sessionHint.value)
  };
};
