import { Outlet } from "react-router";
import { OrganizationProvider, useOrganization } from "~/contexts/OrganizationContext";
import { LoadingSpinner, ErrorAlert } from "~/components/ui";
import { Navigation } from "~/components/layout/Navigation";

export function meta() {
  return [
    { title: "Organization Workspace - Board Yet" },
    { name: "description", content: "Your organization's workspace" },
  ];
}

export default function TenantLayout() {
  return (
    <OrganizationProvider>
      <TenantContent />
    </OrganizationProvider>
  );
}

function TenantContent() {
  const { organization, isLoading, error } = useOrganization();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" message="Loading organization workspace..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <ErrorAlert 
            error={`Failed to load organization: ${error}`}
            onDismiss={() => window.location.href = '/'}
          />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                <strong>{organization.settings.branding.companyName}</strong> workspace
              </span>
              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                ({organization.subdomain}.boardyet.com)
              </span>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}
