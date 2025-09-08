import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MapSection from "../../../components/MapSection";
import RouteForm from "../../../components/RouteForm";

const RoutesPage = ({
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
  resetTrigger,
  onResetComplete,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'route-detail'
  const mapRef = useRef(null);

  const handleRouteSelect = (route) => {
    viewRoute(route);
    setViewMode('route-detail');
  };

  // Reset to dashboard mode when resetTrigger changes (Routes button clicked)
  useEffect(() => {
    if (resetTrigger > 0) {
      setViewMode('dashboard');
      handleCloseRoute();
      // Reset the trigger after completing the reset
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [resetTrigger, handleCloseRoute, onResetComplete]);

  const handleFormSave = async (routeName, addresses) => {
    try {
      await handleSaveRoute(routeName, addresses);
      setShowModal(false); // Close modal on successful save
    } catch (error) {
      console.error("Error saving route:", error);
      // Form will handle error display
    }
  };

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    minHeight: "400px", // Ensure minimum height for proper rendering
  };

  // Show loading state
  if (fetching) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading routes...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading routes</h3>
          <p className="text-gray-600 mb-4">{fetchError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (isEmpty) {
    return (
      <>
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-6xl mb-6">🗺️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Manage Your Routes</h3>
            <p className="text-gray-600 mb-8">
              Create optimized routes for your jobs, track progress, and ensure efficient service delivery to all your clients.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => setShowModal(true)}
                className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Route
              </button>
              <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Import Routes
              </button>
            </div>
            <div className="mt-8 text-sm text-gray-500">
              Start building efficient routes for your team
            </div>
          </div>
        </div>
        
        {/* Route Form Modal */}
        {showModal && (
          <RouteForm 
            onSave={handleFormSave} 
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // Render dashboard or route detail view based on mode
  if (viewMode === 'dashboard') {
    return (
      <>
        {/* Full Dashboard View */}
        <div className="h-full bg-gray-50 p-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Routes Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage and monitor your delivery routes</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
              >
                <span className="text-lg">+</span>
                <span>Create New Route</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Routes</p>
                    <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Today</p>
                    <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Stops</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {routes.reduce((total, route) => total + (route.addresses?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                    <p className="text-2xl font-bold text-gray-900">25 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Routes Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route, index) => (
                <div
                  key={route.id}
                  className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-blue-300 hover:shadow-xl cursor-pointer transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => handleRouteSelect(route)}
                >
                  {/* Route Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {route.route_name?.charAt(0).toUpperCase() || 'R'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {route.name || route.route_name || 'Untitled Route'}
                        </h3>
                        <p className="text-sm text-gray-500">Route #{index + 1}</p>
                      </div>
                    </div>
                    
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Route Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-sm">{route.addresses?.length || 0} stops</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm">~15 min</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Distance: ~12.5 mi</span>
                      <span>ETA: 25 min</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.random() * 60 + 40}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route Form Modal */}
        {showModal && (
          <RouteForm 
            onSave={handleFormSave} 
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // Route Detail View
  return (
    <>
      {/* Map Container with Enhanced UI */}
      <div className="relative h-full w-full">
        <MapSection
          selectedRoute={selectedRoute}
          directions={directions}
          mapContainerStyle={mapContainerStyle}
          center={center}
          mapRef={mapRef}
          handleCloseRoute={handleCloseRoute}
        />
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 space-y-2">
            {/* View Toggle */}
            <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z" />
              </svg>
            </button>
            
            {/* Zoom Controls */}
            <div className="border-t pt-2">
              <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-lg font-bold">
                +
              </button>
              <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-lg font-bold">
                −
              </button>
            </div>
            
            {/* Center Map */}
            <div className="border-t pt-2">
              <button className="w-full p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Route Information Panel (when route is selected) */}
        {selectedRoute && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{selectedRoute.name}</h3>
                <button
                  onClick={handleCloseRoute}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">Stops</p>
                  <p className="font-semibold text-gray-900">{selectedRoute.addresses?.length || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Distance</p>
                  <p className="font-semibold text-gray-900">~12.5 mi</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">~25 min</p>
                </div>
              </div>
              
              <div className="mt-3 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Route
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Route
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Overlay */}
        <div className="absolute top-4 left-96 z-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Routes</p>
                <p className="text-xl font-bold text-gray-900">{routes.length}</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Active Today</p>
                <p className="text-xl font-bold text-green-600">{routes.length}</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Stops</p>
                <p className="text-xl font-bold text-blue-600">
                  {routes.reduce((total, route) => total + (route.addresses?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

RoutesPage.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      route_name: PropTypes.string.isRequired,
      addresses: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  fetching: PropTypes.bool,
  fetchError: PropTypes.string,
  isEmpty: PropTypes.bool,
  directions: PropTypes.object,
  selectedRoute: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    addresses: PropTypes.arrayOf(PropTypes.string),
  }),
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  handleCloseRoute: PropTypes.func,
  viewRoute: PropTypes.func,
  handleSaveRoute: PropTypes.func,
  resetTrigger: PropTypes.number,
  onResetComplete: PropTypes.func,
};

export default RoutesPage;
