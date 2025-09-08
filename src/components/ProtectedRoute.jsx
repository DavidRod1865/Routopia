import PropTypes from "prop-types";
import useUserPermissions from "./hooks/useUserPermissions";

/**
 * Component that protects routes based on user permissions
 * Renders children only if user has access to the specified page/feature
 */
const ProtectedRoute = ({ 
  children, 
  page, 
  permission, 
  fallback = null,
  showError = false 
}) => {
  const { can, hasPermission } = useUserPermissions();

  // Check page-level access
  if (page && !can.accessPage(page)) {
    if (showError) {
      return (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
    return fallback;
  }

  // Check specific permission
  if (permission && !hasPermission(permission)) {
    if (showError) {
      return (
        <div className="flex items-center justify-center min-h-32">
          <div className="text-center">
            <div className="text-2xl mb-2">🚫</div>
            <p className="text-sm text-gray-600">
              You don't have permission to view this content.
            </p>
          </div>
        </div>
      );
    }
    return fallback;
  }

  // User has access - render children
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  page: PropTypes.string, // Page name like 'drivers', 'analytics', etc.
  permission: PropTypes.string, // Specific permission like 'drivers.view', 'analytics.viewOrgWide'
  fallback: PropTypes.node, // What to render when access is denied
  showError: PropTypes.bool, // Whether to show an error message when access is denied
};

export default ProtectedRoute;