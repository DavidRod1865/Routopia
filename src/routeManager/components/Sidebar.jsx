import PropTypes from "prop-types";
import RouteForm from "./RouteForm";
import RouteList from "./RouteList";

const Sidebar = ({
  sidebarOpen,
  fetching,
  fetchError,
  isEmpty,
  routes,
  handleSaveRoute,
  handleDeleteRoute,
  viewRoute,
}) => {
  return (
    <aside
      className={`${
        sidebarOpen ? "block" : "hidden"
      } md:block w-full md:w-80 bg-white shadow-lg p-4 overflow-y-auto transition-all duration-300 ease-in-out`}
    >
      <div className="mb-6">
        <RouteForm onSave={handleSaveRoute} />
      </div>

      <div>
        {fetching ? (
          <p className="text-gray-600 italic">Loading routes...</p>
        ) : fetchError ? (
          <p className="text-red-600">
            Error fetching routes: {fetchError}
          </p>
        ) : isEmpty ? (
          <div className="bg-yellow-100 p-4 rounded">
            <p className="text-center text-gray-700">
              No routes saved yet. Use the form above to add your first route!
            </p>
          </div>
        ) : (
          <RouteList
            routes={routes}
            onDelete={handleDeleteRoute}
            onView={viewRoute}
          />
        )}
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  fetchError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isEmpty: PropTypes.bool.isRequired,
  routes: PropTypes.array.isRequired,
  handleSaveRoute: PropTypes.func.isRequired,
  handleDeleteRoute: PropTypes.func.isRequired,
  viewRoute: PropTypes.func.isRequired,
};

export default Sidebar;
