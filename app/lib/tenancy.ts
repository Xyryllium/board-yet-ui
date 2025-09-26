import type { OrganizationDetails } from '../api/types';

export interface OrganizationSettings {
  theme: {
    primaryColor: string;
    logo?: string;
    customCss?: string;
  };
  // TODO: Add more organization settings as needed, for now we keep it simple
  // features: {
  //   allowGuestAccess: boolean;
  //   maxBoards: number;
  //   maxMembers: number;
  //   allowFileUploads: boolean;
  // };
  branding: {
    companyName: string;
    supportEmail: string;
    customDomain?: string;
  };
}

export interface TenantOrganization extends OrganizationDetails {
  subdomain: string;
  settings: OrganizationSettings;
}

export function getTenantFromHostname(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  if (hostname.includes('localhost')) {
    if (parts.length >= 2 && parts[0] !== 'localhost') {
      return parts[0];
    }
    return null;
  }
  
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0];
  }
  
  return null;
}

export function isMainDomain(): boolean {
  if (typeof window === 'undefined') return true;
  
  const hostname = window.location.hostname;
  const tenant = getTenantFromHostname();
  
  return !tenant || tenant === 'www';
}

export function getMainDomain(): string {
  if (typeof window === 'undefined') return 'boardyet.com';
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('localhost')) {
    return 'localhost';
  }
  
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  
  return hostname;
}

export function buildOrganizationUrl(subdomain: string, path: string = ''): string {
  if (typeof window === 'undefined') return '';
  
  const protocol = window.location.protocol;
  const mainDomain = getMainDomain();
  
  let port = '';
  if (mainDomain.includes('localhost')) {
    port = ':5173';
  } else if (window.location.port && window.location.port !== '80' && window.location.port !== '443') {
    port = `:${window.location.port}`;
  }
  
  return `${protocol}//${subdomain}.${mainDomain}${port}${path}`;
}

export function redirectToOrganization(subdomain: string, path: string = ''): void {
  if (typeof window === 'undefined') return;
  
  const url = buildOrganizationUrl(subdomain, path);
  window.location.href = url;
}


export function redirectToMain(path: string = ''): void {
  if (typeof window === 'undefined') return;
  
  const protocol = window.location.protocol;
  const mainDomain = getMainDomain();
  
  let port = '';
  if (mainDomain.includes('localhost')) {
    port = ':5173';
  } else if (window.location.port && window.location.port !== '80' && window.location.port !== '443') {
    port = `:${window.location.port}`;
  }
  
  const url = `${protocol}//${mainDomain}${port}${path}`;
  window.location.href = url;
}

export function isValidSubdomainFormat(subdomain: string): boolean {
  const regex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
  return regex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 63;
}

export function generateSubdomainFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
}

export function redirectToUserOrganization(subdomain: string, path: string = '/tenant/boards'): void {
  if (typeof window === 'undefined') return;

  const url = buildOrganizationUrl(subdomain, path);
  
  window.location.href = url;
}