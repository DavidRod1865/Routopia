import PropTypes from "prop-types";
import useUserPermissions from "./hooks/useUserPermissions";

const RouteList = ({ routes, onDelete, onView }) => {
  const { can, permissions } = useUserPermissions();
  
  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg space-y-4">
      <h2 className="text-xl font-bold">
        {permissions.routes.viewAll ? "Organization Routes" : "Your Routes"}
      </h2>
      {routes.length === 0 ? (
        <p className="text-gray-500">No routes saved yet.</p>
      ) : (
        <ul className="space-y-2">
          {routes.map((route) => (
            <li
              key={route.id}
              className="flex flex-col justify-between p-4 border rounded-lg hover:shadow-md"
            >
              <div className="">
                <h3 className="font-semibold">{route.route_name}</h3>
                <p className="text-sm text-gray-500">
                  Number of Stops: {route.addresses.length}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(route.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">
                  {route.user_id && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                      Created by: {route.created_by || 'Unknown'}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {can.viewRoute(route) && (
                    <button
                      onClick={() => onView(route)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                    >
                      View
                    </button>
                  )}
                  {can.deleteRoute(route) && (
                    <button
                      onClick={() => onDelete(route.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                  {!can.deleteRoute(route) && can.viewRoute(route) && (
                    <span className="text-xs text-gray-400 italic px-2 py-1">
                      View only
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

RouteList.propTypes = {
  routes: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default RouteList;