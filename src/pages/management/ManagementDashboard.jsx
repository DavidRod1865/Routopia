import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import Header from "../../components/Header";
import ProtectedRoute from "../../components/ProtectedRoute";

// Management Pages
import ClientsPage from "./pages/ClientsPage";
import DriversPage from "./pages/DriversPage";
import RoutesPage from "./pages/RoutesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import useRouteManager from "../../components/hooks/useRouteManager";
import useUserPermissions from "../../components/hooks/useUserPermissions";
import useUserCreation from "../../components/hooks/useUserCreation";
import GoogleMapsProvider from "../../providers/GoogleMapsProvider";

function ManagementDashboard() {
  const {
    user,
    routes,
    fetching,
    fetchError,
    isEmpty,
    directions,
    selectedRoute,
    center,
    handleCloseRoute,
    viewRoute,
    handleSaveRoute,
  } = useRouteManager();
  
  const { can, userRole, isAdmin, isUser } = useUserPermissions();
  
  // Initialize user creation for new users
  useUserCreation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract current page from URL
  const currentPath = location.pathname.split("/dashboard/")[1] || "";
  const activePage = currentPath.split("/")[0] || "routes";

  const allMenuItems = [
    {
      id: "routes",
      label: "Routes",
      icon: "🗺️",
      path: "/dashboard/routes",
      color: "bg-green-100 text-green-700 border border-green-200",
      requiresPermission: null, // All users can access routes
    },
    {
      id: "clients",
      label: "Clients",
      icon: "🏠",
      path: "/dashboard/clients",
      color: "bg-blue-100 text-blue-700 border border-blue-200",
      requiresPermission: null, // All users can access clients
    },
    {
      id: "drivers",
      label: "Drivers",
      icon: "👥",
      path: "/dashboard/drivers",
      color: "bg-red-100 text-red-700 border border-red-200",
      requiresPermission: "users.view", // Only admins can manage drivers (users with 'user' role)
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: "📋",
      path: "/dashboard/assignments",
      color: "bg-purple-100 text-purple-700 border border-purple-200",
      requiresPermission: "assignments.viewAll", // Admins can view all assignments
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "📊",
      path: "/dashboard/analytics",
      color: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      requiresPermission: "analytics.viewOrgWide", // Admins get org-wide analytics
    },
  ];

  // Filter menu items based on user permissions
  const menuItems = allMenuItems.filter(item => 
    !item.requiresPermission || can.accessPage(item.id)
  );

  const handleNavigation = (path) => {
    // Always increment reset trigger when Routes button is clicked
    if (path.includes('/routes')) {
      setResetTrigger(prev => prev + 1);
    }
    navigate(path);
  };

  const handleResetComplete = () => {
    setResetTrigger(0);
  };

  return (
    <GoogleMapsProvider>
      <Header
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="min-h-screen bg-gray-100 flex">
        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarOpen ? "w-72" : "w-0"
          } overflow-hidden flex-shrink-0`}
        >
          {sidebarOpen && (
            <div className="h-full flex flex-col">
              {/* Organization Info */}
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-sm text-gray-600">
                  {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "User"} • Management Dashboard
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                    Administrator
                  </span>
                )}
                {isUser && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Driver
                  </span>
                )}
              </div>

              {/* Navigation Menu */}
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-1 gap-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        activePage === item.id
                          ? `${item.color} font-bold`
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent"
                      }`}
                    >
                      <div className="text-lg">{item.icon}</div>
                      <div className="text-sm font-medium">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto relative">
          <Routes>
            {/* Default redirect to routes */}
            <Route path="/" element={<Navigate to="routes" replace />} />

            {/* Individual Management Pages */}
            <Route
              path="routes"
              element={
                <RoutesPage
                  routes={routes}
                  fetching={fetching}
                  fetchError={fetchError}
                  isEmpty={isEmpty}
                  directions={directions}
                  selectedRoute={selectedRoute}
                  center={center}
                  handleCloseRoute={handleCloseRoute}
                  viewRoute={viewRoute}
                  handleSaveRoute={handleSaveRoute}
                  resetTrigger={resetTrigger}
                  onResetComplete={handleResetComplete}
                />
              }
            />
            <Route
              path="clients"
              element={
                <ClientsPage
                  userProfile={user}
                  // organization={organization}
                />
              }
            />
            <Route
              path="drivers"
              element={
                <ProtectedRoute page="drivers" showError>
                  <DriversPage
                    userProfile={user}
                    // organization={organization}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="assignments"
              element={
                <ProtectedRoute page="assignments" showError>
                  <AssignmentsPage
                    userProfile={user}
                    // organization={organization}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics"
              element={
                <ProtectedRoute page="analytics" showError>
                  <AnalyticsPage
                    userProfile={user}
                    // organization={organization}
                  />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to routes */}
            <Route path="*" element={<Navigate to="routes" replace />} />
          </Routes>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}

ManagementDashboard.propTypes = {
  user: PropTypes.object,
  organization: PropTypes.object,
};

export default ManagementDashboard;
