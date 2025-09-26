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

    if (!userData?.organization_id) {
      return;
    }

    const currentPath = window.location.pathname;
    const expectedSubdomain = `org-${userData.organization_id}`;

    redirectToOrganization(expectedSubdomain, currentPath);
  }, [userData, isLoading]);
}
