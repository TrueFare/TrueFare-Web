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
  const roleHint = useCookie('auth_role_hint');

  const fetchUser = async () => {
    loading.value = true;
    try {
      const headers = useRequestHeaders(['cookie']);
      const data = await $fetch<User>('/api/auth/me', { headers });
      user.value = data;
      if (data) {
        sessionHint.value = data.id;
        roleHint.value = data.role;
      }
    } catch (e: any) {
      user.value = null;
      if (e.statusCode === 401) {
        sessionHint.value = null;
        roleHint.value = null;
      }
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
      if (response) {
        sessionHint.value = response.id;
        roleHint.value = response.role;
      }
      
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
      roleHint.value = null;
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
