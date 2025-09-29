import { Link, useNavigate } from "react-router";
import { getTenantFromHostname, isMainDomain } from "../../lib/tenancy";
import { isAdmin, logoutUser } from "../../lib/auth";
import { useUser } from "../../contexts/UserContext";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Navigation() {
  const navigate = useNavigate();
  const { user: userData, isLoading } = useUser();
  const tenantSlug = getTenantFromHostname();
  const isTenantSubdomain = tenantSlug && !isMainDomain();

  const isUserAdmin = userData ? isAdmin(userData) : false;
  const hasOrganization = userData ? (userData.organization_id && userData.subdomain) : false;

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (isTenantSubdomain) {
        window.location.href = '/';
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getTenantUrl = (path: string) => {
    return `/tenant${path}`;
  };

  if (isLoading) {
    return (
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex-between">
            <div className="flex items-center space-x-6">
              <Link to={userData && userData.organization_id && userData.subdomain ? getTenantUrl("/boards") : "/member"} className="nav-brand">
                Board Yet
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link to={hasOrganization ? getTenantUrl(isUserAdmin ? "/" : "/boards") : "/member"} className="nav-brand text-xl sm:text-2xl">
              Board Yet
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm text-gray-600 dark:text-gray-300">
            {isUserAdmin && (
              <div className="flex items-center space-x-4 lg:space-x-6">
                <Link to={getTenantUrl("/")} className="nav-link whitespace-nowrap">
                  Dashboard
                </Link>
                <Link to={getTenantUrl("/boards")} className="nav-link whitespace-nowrap">
                  Boards
                </Link>
                <Link to={getTenantUrl("/settings")} className="nav-link whitespace-nowrap">
                  Settings
                </Link>
              </div>
            )}
            
            {!isUserAdmin && hasOrganization && (
              <div className="flex items-center space-x-4 lg:space-x-6">
                <Link to={getTenantUrl("/boards")} className="nav-link whitespace-nowrap">
                  My Boards
                </Link>
              </div>
            )}
            
            {userData && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="truncate max-w-24">{userData.name}</span>
                <span className="text-gray-400">•</span>
                {userData.organization_id && (
                  <>
                    <span className="whitespace-nowrap">Org #{userData.organization_id}</span>
                    {userData.role && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="capitalize whitespace-nowrap">{userData.role}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="nav-link hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {userData && (
              <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-300">
                <span className="truncate max-w-16">{userData.name}</span>
                {userData.organization_id && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="whitespace-nowrap">#{userData.organization_id}</span>
                  </>
                )}
              </div>
            )}
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-xs px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-2">
            {isUserAdmin && (
              <>
                <Link to={getTenantUrl("/")} className="nav-link py-2">
                  Dashboard
                </Link>
                <Link to={getTenantUrl("/boards")} className="nav-link py-2">
                  Boards
                </Link>
                <Link to={getTenantUrl("/settings")} className="nav-link py-2">
                  Settings
                </Link>
              </>
            )}
            
            {!isUserAdmin && hasOrganization && (
              <Link to={getTenantUrl("/boards")} className="nav-link py-2">
                My Boards
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
