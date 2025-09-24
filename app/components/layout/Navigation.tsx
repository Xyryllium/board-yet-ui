import { Link, useNavigate } from "react-router";
import { getUserData, isAdmin, logoutUser } from "../../lib/auth";

export function Navigation() {
  const navigate = useNavigate();
  const userData = getUserData();
  const isUserAdmin = isAdmin();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex-between">
          <div className="flex items-center space-x-6">
            <Link to={`${isUserAdmin ? "/organization-dashboard" :  "/boards"}`} className="nav-brand">
              Board Yet
            </Link>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            {isUserAdmin && (
              <div className="flex items-center space-x-4">
                <Link to="/organization-dashboard" className="nav-link">
                  Dashboard
                </Link>
                {/* <Link to="/organization-overview" className="nav-link">
                  Overview
                </Link> */}
                <Link to="/boards" className="nav-link">
                  Boards
                </Link>
              </div>
            )}
            
            {userData && (
            <div className="flex items-center space-x-2">
              <span>{userData.name}</span>
              <span className="text-gray-400">•</span>
              {userData.organization_id && (
                <>
                  <span>Org #{userData.organization_id}</span>
                  {userData.role && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="capitalize">{userData.role}</span>
                    </>
                  )}
                </>
              )}
            </div>
            )}
            <button
              onClick={handleLogout}
              className="nav-link hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
