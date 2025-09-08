import { Link } from "react-router";

export function Navigation() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex-between">
          <Link to="/" className="nav-brand">
            Board Yet
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/organization-dashboard" className="nav-link">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
