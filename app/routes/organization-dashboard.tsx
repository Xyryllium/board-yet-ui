import type { Route } from "./+types/organization-dashboard";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Organization Dashboard - Board Yet" },
    { name: "description", content: "Your organization dashboard" },
  ];
}

export default function OrganizationDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Organization Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome to your organization workspace
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Members</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">Admin User</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">admin@example.com</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    Admin
                  </span>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">Member User</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">member@example.com</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full">
                    Member
                  </span>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    Y
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">You</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">you@example.com</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                    You
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200">
                  Invite New Member
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Members</span>
                    <span className="font-semibold text-gray-900 dark:text-white">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Active Projects</span>
                    <span className="font-semibold text-gray-900 dark:text-white">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completed Tasks</span>
                    <span className="font-semibold text-gray-900 dark:text-white">24</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white">New member joined</p>
                    <p className="text-gray-500 dark:text-gray-400">2 hours ago</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white">Project updated</p>
                    <p className="text-gray-500 dark:text-gray-400">1 day ago</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white">Task completed</p>
                    <p className="text-gray-500 dark:text-gray-400">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              to="/organization-home"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Manage Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
