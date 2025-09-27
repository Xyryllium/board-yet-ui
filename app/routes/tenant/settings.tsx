// import type { Route } from "./+types/tenant";
import { useOrganization, useOrganizationTheme } from "~/contexts/OrganizationContext";
import { useUser } from "~/contexts/UserContext";
import { useTheme } from "~/contexts/ThemeContext";
import { useState } from "react";
import { updateOrganizationSettings, validateSubdomain as validateSubdomainApi } from "~/api/organizations/updateSettings";
import { generateSubdomainFromName } from "~/lib/tenancy";

export function meta() {
  return [
    { title: "Settings - Board Yet" },
    { name: "description", content: "Manage your organization settings" },
  ];
}

export default function OrganizationSettings() {
  const { organization, isLoading, error, refreshOrganization } = useOrganization();
  const { refreshUser } = useUser();
  const { companyName } = useOrganizationTheme();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    subdomain: organization?.subdomain || '',
    companyName: organization?.settings.branding.companyName || '',
    supportEmail: organization?.settings.branding.supportEmail || '',
    primaryColor: organization?.settings.theme.primaryColor || '#3b82f6',
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isValidatingSubdomain, setIsValidatingSubdomain] = useState(false);
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'validating' | 'available' | 'unavailable'>('idle');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'companyName') {
      const subdomain = generateSubdomainFromName(value);
      setFormData(prev => ({ ...prev, subdomain }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateSubdomain = async (subdomain: string) => {
    if (!subdomain || subdomain === organization?.subdomain) {
      setSubdomainStatus('idle');
      return;
    }

    setIsValidatingSubdomain(true);
    setSubdomainStatus('validating');

    try {
      const result = await validateSubdomainApi(subdomain, organization?.id);
      setSubdomainStatus(result.available ? 'available' : 'unavailable');
      setErrors(prev => ({
        ...prev,
        subdomain: result.available ? undefined : result.error
      }));
    } catch (error) {
      setSubdomainStatus('unavailable');
      setErrors(prev => ({
        ...prev,
        subdomain: 'Failed to validate subdomain'
      }));
    } finally {
      setIsValidatingSubdomain(false);
    }
  };

  const handleSave = async () => {
    if (!organization) return;

    setIsLoadingSave(true);
    setErrors({});

    try {
      const settingsData = {
        subdomain: formData.subdomain,
        settings: {
          theme: {
            primaryColor: formData.primaryColor,
          },
          branding: {
            companyName: formData.companyName,
            supportEmail: formData.supportEmail,
          },
          //features: organization.settings.features, // Keep existing features
        }
      };

      const response = await updateOrganizationSettings(organization.id, settingsData);

      if (response.success) {
        setIsEditing(false);
        
        const subdomainChanged = formData.subdomain !== organization.subdomain;
        
        if (subdomainChanged) {
          await refreshUser();

          const { redirectToUserOrganization } = await import('~/lib/tenancy');
          
          redirectToUserOrganization(formData.subdomain, '/tenant/settings');
        } else {
          await refreshOrganization();
        }
      } else {
        setErrors({ general: response.error || 'Failed to save settings' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      subdomain: organization?.subdomain || '',
      companyName: organization?.settings.branding.companyName || '',
      supportEmail: organization?.settings.branding.supportEmail || '',
      primaryColor: organization?.settings.theme.primaryColor || '#3b82f6',
    });
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Organization Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The organization you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Organization Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your organization's subdomain, branding, and settings
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-outline"
            >
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="space-y-6 py-5">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Workspace URL
            </h3>
            <div className="flex items-center space-x-3">
              <span className="text-lg font-mono text-blue-600 dark:text-blue-400">
                {organization.subdomain}.boardyet.com
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This is your organization's unique workspace URL
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Branding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {organization.settings.branding.companyName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Support Email</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {organization.settings.branding.supportEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Primary Color</p>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: organization.settings.theme.primaryColor }}
                  />
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {organization.settings.theme.primaryColor}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Theme Preference</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {theme === 'system' ? `System (${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'})` : theme}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-5">
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workspace URL
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => {
                    handleInputChange('subdomain', e.target.value);
                    setTimeout(() => validateSubdomain(e.target.value), 500);
                  }}
                  className={`form-input flex-1 ${errors.subdomain ? 'border-red-500' : ''}`}
                  placeholder="your-company"
                />
                <span className="text-gray-500 dark:text-gray-400">.boardyet.com</span>
                {isValidatingSubdomain && (
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                )}
                {subdomainStatus === 'available' && (
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {subdomainStatus === 'unavailable' && (
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.subdomain && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subdomain}</p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose a unique subdomain for your organization. This will be your workspace URL.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="form-input"
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                className="form-input"
                placeholder="support@yourcompany.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="form-input flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme Preference
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={(e) => setTheme(e.target.value as 'light')}
                    className="form-checkbox mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Light</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.value as 'dark')}
                    className="form-checkbox mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Dark</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="system"
                    checked={theme === 'system'}
                    onChange={(e) => setTheme(e.target.value as 'system')}
                    className="form-checkbox mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">System</span>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose your preferred theme. System will follow your device's theme setting.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={handleCancel}
              className="btn-outline"
              disabled={isLoadingSave}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary"
              disabled={isLoadingSave || subdomainStatus === 'validating' || subdomainStatus === 'unavailable'}
            >
              {isLoadingSave ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
