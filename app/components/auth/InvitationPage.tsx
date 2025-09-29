import { useState } from "react";
import { useNavigate } from "react-router";
import { FormHeader } from "../forms";
import { SubmitButton } from "../forms";
import { acceptInvitation, listOrganizationDetails } from "../../lib/member";
import { getCurrentUser } from "../../lib/auth";
import { formatIconText } from "../../lib/stringUtils";
import type { OrganizationDetails } from "../../api/types";

export function InvitationPage() {
  const navigate = useNavigate();
  const [invitationUrl, setInvitationUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrg, setIsLoadingOrg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [organization, setOrganization] = useState<OrganizationDetails | null>(null);
  const [organizationInitials, setOrganizationInitials] = useState<string>('BY');
  const [showInvitationDetails, setShowInvitationDetails] = useState(false);
  const [extractedToken, setExtractedToken] = useState<string | null>(null);

  const extractTokenFromUrl = (url: string): string | null => {
    try {
      let token = url.trim();
      
      if (token.includes('/invitations/accept/')) {
        const parts = token.split('/invitations/accept/');
        token = parts[parts.length - 1];
      } else if (token.includes('/')) {
        const parts = token.split('/');
        token = parts[parts.length - 1];
      }
      
      token = token.split('?')[0].split('#')[0];
      
      return token.length > 0 ? token : null;
    } catch (error) {
      return null;
    }
  };

  const handleSubmitUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationUrl.trim()) {
      setError("Please enter an invitation link");
      return;
    }

    const token = extractTokenFromUrl(invitationUrl);
    if (!token) {
      setError("Invalid invitation link format. Please check the link and try again.");
      return;
    }

    setExtractedToken(token);
    setError(null);
    setIsLoadingOrg(true);

    try {
      const response = await listOrganizationDetails(token);
      
      if (response.success) {
        const orgData = (response.data as any)?.organization || response.data;
        const initials = formatIconText(orgData.name);
        setOrganizationInitials(initials);
        setOrganization(orgData || null);
        setShowInvitationDetails(true);
      } else {
        setError(response.error || 'Invalid invitation link. Please check the link and try again.');
      }
    } catch (error) {
      setError('Failed to load invitation details. Please check the link and try again.');
    } finally {
      setIsLoadingOrg(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!extractedToken) return;

    try {
      setIsLoading(true);
      setError(null);
      const currentUser = await getCurrentUser();
      
      const response = await acceptInvitation(extractedToken);
      
      if (response.success && response.status === 'user_not_registered') {
        const email = response.email || '';
        const message = 'You need to create an account to accept this invitation.';
        const url = `/?tab=signup&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}&invitation_token=${encodeURIComponent(extractedToken)}`;
        navigate(url);
      } else if (response.success) {
        setSuccess(true);
        if (currentUser) {
          const userSubdomain = currentUser.subdomain || '';
          const { redirectToUserOrganization } = await import('../../lib/tenancy');
          redirectToUserOrganization(userSubdomain, '/tenant/boards');
        } else {
          navigate("/tenant/boards");
        }
      } else {
        setError(response.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInvitationUrl("");
    setError(null);
    setSuccess(false);
    setOrganization(null);
    setShowInvitationDetails(false);
    setExtractedToken(null);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="space-content">
              <FormHeader 
                title="Join Organization" 
                description="Enter an invitation link to join an organization and start collaborating."
              />

              {!showInvitationDetails ? (
                <form className="form-fields" onSubmit={handleSubmitUrl}>
                  <div>
                    <label htmlFor="invitationUrl" className="form-label">
                      Invitation Link
                    </label>
                    <input
                      type="text"
                      id="invitationUrl"
                      className={`form-input ${error ? 'form-input-error' : ''}`}
                      placeholder="Paste your invitation link here"
                      value={invitationUrl}
                      onChange={(e) => {
                        setInvitationUrl(e.target.value);
                        if (error) setError(null);
                      }}
                      required
                      autoFocus
                    />
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      You can paste the full invitation link or just the token from the URL.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <SubmitButton 
                    className="btn-primary w-full" 
                    disabled={isLoadingOrg}
                  >
                    {isLoadingOrg ? "Loading..." : "Load Invitation"}
                  </SubmitButton>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Organization Details */}
                  <div className="text-center space-y-4">
                    <div className="invitation-icon">
                      <span className="text-2xl font-bold text-white">
                        {organizationInitials}
                      </span>
                    </div>
                    <div>
                      <h2 className="heading-4">
                        Join {organization?.name || 'Organization'}?
                      </h2>
                      <p className="text-body-sm mt-2">
                        You've been invited to join this organization and collaborate on projects.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Organization:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {organization?.name || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Invited by:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {organization?.owner?.name || 'Unknown'}
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

                  {success && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-green-600 dark:text-green-400 text-sm">
                        Invitation accepted successfully! Redirecting...
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={handleAcceptInvitation}
                      disabled={isLoading || success}
                      className="flex-1 btn-primary text-center"
                    >
                      {isLoading ? "Accepting Invitation..." : success ? "Accepted!" : "Accept Invitation"}
                    </button>
                    <button 
                      onClick={handleReset}
                      disabled={isLoading || success}
                      className="flex-1 btn-outline"
                    >
                      Try Different Link
                    </button>
                  </div>

                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>This invitation will expire in 7 days.</p>
                    <p>If you don't have an account, you'll be prompted to create one.</p>
                  </div>
                </div>
              )}

              <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Don't have an invitation?{" "}
                  <button 
                    onClick={() => navigate("/member")}
                    className="link-primary"
                  >
                    Go back to options
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
