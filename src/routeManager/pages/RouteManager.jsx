import GoogleMapsProvider from "../../providers/GoogleMapsProvider";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MapSection from "../components/MapSection";
import useRouteManager from "../components/hooks/useRouteManager";

function RouteManager() {
  const {
    user,
    sidebarOpen,
    setSidebarOpen,
    routes,
    fetching,
    fetchError,
    isEmpty,
    directions,
    selectedRoute,
    center,
    handleCloseRoute,
    handleSaveRoute,
    handleDeleteRoute,
    viewRoute,
  } = useRouteManager();

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-400">
      <Header
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <GoogleMapsProvider>
        {/* Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            sidebarOpen={sidebarOpen}
            fetching={fetching}
            fetchError={fetchError}
            isEmpty={isEmpty}
            routes={routes}
            handleSaveRoute={handleSaveRoute}
            handleDeleteRoute={handleDeleteRoute}
            viewRoute={viewRoute}
          />

          {/* Main (Map + Details Panel) */}
          <MapSection
            selectedRoute={selectedRoute}
            directions={directions}
            mapContainerStyle={mapContainerStyle}
            center={center}
            handleCloseRoute={handleCloseRoute}
          />
        </div>
      </GoogleMapsProvider>
    </div>
  );
};

export default RouteManager;
