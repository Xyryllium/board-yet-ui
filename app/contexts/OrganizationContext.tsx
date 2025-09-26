import { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { getTenantFromHostname, buildOrganizationUrl, redirectToOrganization, redirectToUserOrganization } from '~/lib/tenancy';
import { getOrganizationBySubdomain } from '~/api/organizations/getBySubdomain';
import { useUser } from '~/contexts/UserContext';
import type { TenantOrganization } from '~/lib/tenancy';

interface OrganizationContextType {
  organization: TenantOrganization | null;
  isLoading: boolean;
  error: string | null;
  switchOrganization: (subdomain: string) => void;
  refreshOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const { user: userData } = useUser();
  const [organization, setOrganization] = useState<TenantOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const fetchOrganization = async (subdomain: string): Promise<TenantOrganization | null> => {
    try {
      const response = await getOrganizationBySubdomain(subdomain);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to fetch organization');
    } catch (err) {
      console.error('Failed to fetch organization:', err);
      return null;
    }
  };

  const loadOrganization = async () => {
    if (loadingRef.current) {
      return;
    }
    
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const subdomain = getTenantFromHostname();
      
      if (subdomain) {
        const organizationData = await fetchOrganization(subdomain);
        setOrganization(organizationData);
        
        if (!organizationData) {
          setError('Organization not found');
        }
      } else {
        if (userData?.subdomain) {
          redirectToUserOrganization(userData.subdomain, '/tenant/boards');
        } else {
          setError('No organization found. Please contact support.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organization');
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  };

  const switchOrganization = (subdomain: string) => {
    redirectToOrganization(subdomain);
  };

  const refreshOrganization = async () => {
    await loadOrganization();
  };

  useEffect(() => {
    loadOrganization();
  }, []);

  const value: OrganizationContextType = {
    organization,
    isLoading,
    error,
    switchOrganization,
    refreshOrganization,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextType {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}

export function useOrganizationTheme() {
  const { organization } = useOrganization();
  
  return {
    primaryColor: organization?.settings.theme.primaryColor || '#3b82f6',
    logo: organization?.settings.theme.logo,
    customCss: organization?.settings.theme.customCss,
    companyName: organization?.settings.branding.companyName || 'Board Yet',
  };
}
