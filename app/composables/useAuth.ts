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

  const fetchUser = async () => {
    loading.value = true;
    try {
      // Use useRequestHeaders to pass cookies on server-side
      const headers = useRequestHeaders(['cookie']);
      const data = await $fetch<User>('/api/auth/me', { headers });
      user.value = data;
    } catch (e) {
      user.value = null;
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
    logout
  };
};
