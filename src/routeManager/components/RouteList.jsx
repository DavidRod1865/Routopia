import PropTypes from "prop-types";

const RouteList = ({ routes, onDelete, onView }) => {
  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Your Routes</h2>
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
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => onView(route)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                >
                  View
                </button>
                <button
                  onClick={() => onDelete(route.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
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