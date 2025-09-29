import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FormHeader } from "../forms";
import { SubmitButton } from "../forms";
import { createOrganization as createOrganizationAPI } from "../../api/organizations/create";
import { generateSubdomainFromName } from "../../lib/tenancy";
import { useUser } from "../../contexts/UserContext";

export function MemberPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizationData, setOrganizationData] = useState({
    name: ""
  });

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizationData.name.trim()) {
      setError("Organization name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const subdomain = generateSubdomainFromName(organizationData.name.trim());
      
      const orgResponse = await createOrganizationAPI({
        name: organizationData.name.trim(),
        subdomain: subdomain,
        settings: {
          theme: {
            primaryColor: '#8b5cf6',
            logo: undefined,
            customCss: undefined,
          },
          branding: {
            companyName: organizationData.name.trim(),
            supportEmail: user?.email || '',
            customDomain: undefined,
          },
        }
      });
      
      if (orgResponse.success) {
        await refreshUser();
        
        const { redirectToUserOrganization } = await import('../../lib/tenancy');
        redirectToUserOrganization(subdomain, '/tenant/');
      } else {
        setError(orgResponse.error || "Failed to create organization. Please try again.");
      }
    } catch (error) {
      console.error('Organization creation error:', error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinOrganization = () => {
    navigate("/invitation");
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="space-content">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                <FormHeader 
                  title={`Welcome, ${user?.name || 'Member'}!`}
                  description="You're successfully registered! Now let's get you set up with an organization to start collaborating."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="heading-5 mb-2">Create Organization</h3>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">
                      Start your own organization and invite team members to collaborate.
                    </p>
                  </div>

                  <form onSubmit={handleCreateOrganization} className="space-y-4">
                    <div>
                      <label htmlFor="orgName" className="form-label">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        id="orgName"
                        className={`form-input ${error ? 'form-input-error' : ''}`}
                        placeholder="Enter organization name"
                        value={organizationData.name}
                        onChange={(e) => {
                          setOrganizationData(prev => ({ ...prev, name: e.target.value }));
                          if (error) setError(null);
                        }}
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <SubmitButton 
                      className="btn-primary w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Organization"}
                    </SubmitButton>
                  </form>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="heading-5 mb-2">Join Organization</h3>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">
                      Have an invitation link? Join an existing organization.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-green-600 dark:text-green-400 text-sm mb-3">
                        <strong>How to join:</strong>
                      </p>
                      <ol className="text-green-600 dark:text-green-400 text-sm space-y-1 list-decimal list-inside">
                        <li>Ask your team admin for an invitation link</li>
                        <li>Click the link to accept the invitation</li>
                        <li>You'll be automatically added to the organization</li>
                      </ol>
                    </div>

                    <button
                      onClick={handleJoinOrganization}
                      className="btn-secondary w-full"
                    >
                      Enter Invitation Link
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Need help?{" "}
                  <a href="mailto:support@boardyet.com" className="link-primary">
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
