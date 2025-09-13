import { useState, useEffect } from 'react';
import { getAuthToken, getUserData, isAuthenticated } from '~/lib/auth';

export function useAuth() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = () => {
      const authToken = getAuthToken();
      const authenticated = isAuthenticated();
      const userData = getUserData();

      setToken(authToken);
      setIsAuth(authenticated);
      
      if (userData && userData.organization_id) {
        setOrganizationId(userData.organization_id);
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  return {
    isAuth,
    token,
    organizationId,
    isInitialized
  };
}
