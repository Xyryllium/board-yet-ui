import { useState, useEffect } from 'react';
import { getAuthToken, isAuthenticated } from '~/lib/auth';
import { useUser } from '~/contexts/UserContext';

export function useAuth() {
  const { user, isLoading: userLoading } = useUser();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = () => {
      const authToken = getAuthToken();
      const authenticated = isAuthenticated();

      setToken(authToken);
      setIsAuth(authenticated);
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  return {
    isAuth,
    token,
    organizationId: user?.organization_id || null,
    isInitialized: isInitialized && !userLoading
  };
}
