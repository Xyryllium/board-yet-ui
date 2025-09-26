import type { Route } from "./+types/organization-dashboard";
import { Link } from "react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { getAuthToken } from "../lib/auth";
import { useUser } from "../contexts/UserContext";
import { AuthRequired } from "../components/auth";
import { DashboardHeader } from "~/components/dashboard/DashboardHeader";
import { MemberInviteForm } from "~/components/dashboard/MemberInviteForm";
import { fetchAllMembers, inviteMember} from "~/lib/member";
import { Notification } from "~/components/ui/Notification";
import { formatIconText } from "~/lib/stringUtils";
import type { Member } from "~/api/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Organization Dashboard - Board Yet" },
    { name: "description", content: "Manage your organization and invite members" },
  ];
}

export default function OrganizationDashboard() {
  const { user: userData, isLoading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [userInitials, setUserInitials] = useState<string>('Y');
  const hasFetchedMembers = useRef(false);

  const clearNotification = () => {
    setNotification(null);
  };

  const isAuth = !!userData;

  useEffect(() => {
    if (userData?.name) {
      setUserInitials(formatIconText(userData.name));
    }
  }, [userData]);

  const fetchMembers = useCallback(async (organizationId: number) => {
    if (organizationId === 0) {
      setMembers([]);
      return;
    }
    
    try {
      const response = await fetchAllMembers(organizationId);
      if (response.success && response.members) {
        setMembers(response.members);
      } else {  
        setMembers([]);
        console.error('Failed to fetch members:', response.error);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedMembers.current) {
      return;
    }
    
    if (userData && userData.organization_id) {
      fetchMembers(userData.organization_id);
      hasFetchedMembers.current = true;
    }
  }, [fetchMembers, userData]);

  const sendInvitation = async (email: string, role: string): Promise<boolean> => {
    if (!userData?.organization_id) {
      throw new Error('Organization ID not found');
    }
    const memberInfo: Member = { email, role };
    const response = await inviteMember(memberInfo, userData.organization_id);
    return response.success && !!response.invitation;
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleInvite = async (memberEmail: string, adminEmail?: string) => {
    setIsLoading(true);
    
    try {
      if (!userData?.organization_id) {
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

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {userData && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      { userInitials }
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">You ({userData.role})</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{userData.email}</p>
                    </div>
                  </div>
                )}
                
                { members.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No other members yet</p>
                    <p className="text-sm">Invite members to get started</p>
                  </div>
                ): (
                  members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        { member.name ? formatIconText(member.name) : 'M' }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">{member.name} ({member.role})</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  ))
                )}

              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            {/* <Link
              to="/organization-overview"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              View Overview
            </Link> */}
            <Link
              to="/tenant/boards"
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
            >
              Manage Board
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}