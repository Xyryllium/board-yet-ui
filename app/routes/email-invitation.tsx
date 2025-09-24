import { useEffect, useState } from "react";
import type { Route } from "./+types/email-invitation";
import { useNavigate } from "react-router";
import { acceptInvitation, listOrganizationDetails } from "~/lib/member";
import { getUserData, storeUserData } from "~/lib/auth";
import type { OrganizationDetails } from "~/api";
import { formatIconText } from "~/lib/stringUtils";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: "Email Invitation - Board Yet" },
    { name: "description", content: "You've been invited to join an organization" },
  ];
}

export default function EmailInvitation({params}: Route.ComponentProps) {
  const navigate = useNavigate();
  const token = params.token;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [organization, setOrganization] = useState<OrganizationDetails | null>(null);
  const [organizationInitials, setOrganizationInitials] = useState<string>('BY');

  const handleAcceptInvitation = async () => {
    try {
      setIsLoading(true);
      const response = await acceptInvitation(token);
      
      if (response.success && response.status === 'user_not_registered') {
        const email = response.email || '';
        const message = 'You need to create an account to accept this invitation.';
        const url = `/?tab=signup&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}&invitation_token=${encodeURIComponent(token)}`;
        navigate(url);
      } else if (response.success) {
        const currentUserData = getUserData();
        
        if (currentUserData) {
          let updatedUserData = { ...currentUserData };

          if (response.invitation) {
            updatedUserData.organization_id = response.invitation.organization_id;
            updatedUserData.role = response.invitation.role;
          }

          if (!updatedUserData.organization_id && organization) {
            updatedUserData.organization_id = organization.id;
            updatedUserData.role = 'member';
          }

          if (!updatedUserData.organization_id) {
            console.warn('No organization ID found in invitation response or page data');
          }

          storeUserData(updatedUserData);
        }
        
        setSuccess(true);
        navigate("/boards");
      } else {
        setError(response.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchOrganizationDetails = async () => {
    try {
      setIsLoadingOrg(true);
      const response = await listOrganizationDetails(token);
      
      if(response.success) {
        const orgData = (response.data as any)?.organization || response.data;
        const initials = formatIconText(orgData.name);
        setOrganizationInitials(initials);
        setOrganization(orgData || null);
      } else {
        setError(response.error || 'Failed to fetch organization details');
      }
    } catch (error) {
      setError('Network error occurred while fetching organization details');
    } finally {
      setIsLoadingOrg(false);
    }
  }

  useEffect(() => {
    fetchOrganizationDetails();
  }, []);

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-4">
              Email Invitation
            </h1>
            <p className="text-body">
              You've received an invitation to join an organization
            </p>
          </div>

          <div className="card">
            <div className="text-center space-y-6">
              <div className="form-fields">
                <div className="invitation-icon">
                  <span className="text-2xl font-bold text-white">
                    {isLoadingOrg ? 'BY' : organizationInitials}
                  </span>
                </div>
                <div>
                  <h2 className="heading-4">
                    Do you want to join {isLoadingOrg ? 'Loading...' : (organization?.name || 'Organization')}?
                  </h2>
                  <p className="text-body-sm mt-2">
                    You've been invited to join this organization and collaborate on projects.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Invited by:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isLoadingOrg ? 'Loading...' : (organization?.owner?.name || 'Unknown')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Role:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Member</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
              

              <div className="flex gap-4">
                <button
                  onClick={handleAcceptInvitation}
                  disabled={isLoading}
                  className="flex-1 btn-primary text-center"
                >
                  {isLoading ? "Accepting Invitation..." : "Accept Invitation"}
                </button>
                <button className="flex-1 btn-outline">
                  Decline
                </button>
              </div>

              <div className="member-email">
                <p>This invitation will expire in 7 days.</p>
                <p>If you don't have an account, you'll be prompted to create one.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
