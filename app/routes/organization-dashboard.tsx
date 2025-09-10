import type { Route } from "./+types/organization-dashboard";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getAuthToken, isAuthenticated, getUserData } from "../lib/auth";
import { AuthRequired } from "../components/auth";
import { DashboardHeader } from "~/components/dashboard/DashboardHeader";
import { MemberInviteForm } from "~/components/dashboard/MemberInviteForm";
import { inviteMember, type Member } from "~/lib/member";
import { Notification } from "~/components/ui/Notification";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Organization Dashboard - Board Yet" },
    { name: "description", content: "Manage your organization and invite members" },
  ];
}

export default function OrganizationDashboard() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const clearNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    const authToken = getAuthToken();
    const authenticated = isAuthenticated();
    const userData = getUserData();
    
    setToken(authToken);
    setIsAuth(authenticated);
    
    if (userData && userData.organization_id) {
      setOrganizationId(userData.organization_id);
    }
  }, []);

  const sendInvitation = async (email: string, role: string): Promise<boolean> => {
    if (!organizationId) {
      throw new Error('Organization ID not found');
    }
    const memberInfo: Member = { email, role };
    const response = await inviteMember(memberInfo, organizationId);
    return response.success && !!response.invitation;
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleInvite = async (memberEmail: string, adminEmail?: string) => {
    setIsLoading(true);
    
    try {
      if (!organizationId) {
        showNotification("Organization ID not found. Please log in again.", 'error');
        return;
      }

      if (!memberEmail && !adminEmail) {
        showNotification("Please enter at least one email address", 'error');
        return;
      }

      const invitations = [];
      
      if (memberEmail) {
        invitations.push({ email: memberEmail, role: "member" });
      }
      if (adminEmail) {
        invitations.push({ email: adminEmail, role: "admin" });
      }

      const results = await Promise.all(
        invitations.map(({ email, role }) => sendInvitation(email, role))
      );

      const successCount = results.filter(Boolean).length;
      const totalCount = invitations.length;

      if (successCount === totalCount) {
        const message = totalCount === 1 
          ? `${invitations[0].role} invitation sent successfully!`
          : "All invitations sent successfully!";
        showNotification(message, 'success');
      } else if (successCount > 0) {
        showNotification(`${successCount} of ${totalCount} invitations sent successfully`, 'error');
      } else {
        showNotification("Failed to send invitations", 'error');
      }

    } catch (error) {
      showNotification("An error occurred while sending the invitation", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuth) {
    return (
      <AuthRequired
        title="Authentication Required"
        message="Please log in to access the organization dashboard."
        loginPath="/"
        loginText="Go to Login"
      />
    );
  }

  return (
    <div className="page-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <DashboardHeader 
            title="Organization Dashboard"
            description="Manage your organization and invite members"
          />

          <div className="grid-2-lg">
            <MemberInviteForm 
              onInvite={handleInvite}
              isLoading={isLoading}
            />

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Current Members</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    Y
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">You (Admin)</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">you@example.com</p>
                  </div>
                </div>
                
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No other members yet</p>
                  <p className="text-sm">Invite members to get started</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/organization-overview"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              View Overview
            </Link>
            <Link
              to="/board-dashboard"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Manage Board
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}