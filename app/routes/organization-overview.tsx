import type { Route } from "./+types/organization-overview";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getAuthToken, isAuthenticated } from "../lib/auth";
import { AuthRequired } from "../components/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Organization Overview - Board Yet" },
    { name: "description", content: "Your organization overview and statistics" },
  ];
}

export default function OrganizationOverview() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const authToken = getAuthToken();
    const authenticated = isAuthenticated();
    
    setToken(authToken);
    setIsAuth(authenticated);
    
    if (authToken) {
      console.log('Auth token found:', authToken);
    } else {
      console.log('No auth token found in localStorage');
    }
  }, []);

  if (!isAuth) {
    return (
      <AuthRequired
        title="Authentication Required"
        message="Please log in to access the organization overview."
        loginPath="/"
        loginText="Go to Login"
      />
    );
  }

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="heading-2 mb-4">
              Organization Overview
            </h1>
            <p className="text-body">
              View your organization statistics and member insights
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4">Members</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="member-card">
                  <div className="member-avatar member-avatar-blue">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="member-name">Admin User</p>
                    <p className="member-email">admin@example.com</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    Admin
                  </span>
                </div>

                <div className="member-card">
                  <div className="member-avatar member-avatar-blue">
                    M
                  </div>
                  <div className="flex-1">
                    <p className="member-name">Member User</p>
                    <p className="member-email">member@example.com</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full">
                    Member
                  </span>
                </div>

                <div className="member-card">
                  <div className="member-avatar member-avatar-blue">
                    Y
                  </div>
                  <div className="flex-1">
                    <p className="member-name">You</p>
                    <p className="member-email">you@example.com</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                    You
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link 
                  to="/invite-members"
                  className="block w-full btn-primary text-center"
                >
                  Invite New Member
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-sm">
                <h3 className="heading-5 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-body-sm">Total Members</span>
                    <span className="text-body-stat">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-sm">Active Projects</span>
                    <span className="text-body-stat">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-sm">Completed Tasks</span>
                    <span className="text-body-stat">24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/organization-dashboard"
              className="px-6 py-3 btn-outline"
            >
              Back to Home
            </Link>
            <Link
              to="/organization-dashboard"
              className="px-6 py-3 btn-primary"
            >
              Manage Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
