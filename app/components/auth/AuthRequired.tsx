import { Link } from "react-router";

interface AuthRequiredProps {
  title?: string;
  message?: string;
  loginPath?: string;
  loginText?: string;
}

export default function AuthRequired({
  title = "Authentication Required",
  message = "Please log in to access this page.",
  loginPath = "/",
  loginText = "Go to Login"
}: AuthRequiredProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
          <Link
            to={loginPath}
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            {loginText}
          </Link>
        </div>
      </div>
    </div>
  );
}
