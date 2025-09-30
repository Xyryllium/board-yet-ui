import { useEffect } from 'react';
import { getTenantFromHostname, redirectToOrganization } from '~/lib/tenancy';
import { useUser } from '~/contexts/UserContext';

export function useOrganizationRedirect() {
  const { user: userData, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const subdomain = getTenantFromHostname();

    if (subdomain) {
      return;
    }

    if (!userData?.subdomain) {
      return;
    }

    const currentPath = window.location.pathname;

    redirectToOrganization(userData.subdomain, currentPath);
  }, [userData, isLoading]);
}
