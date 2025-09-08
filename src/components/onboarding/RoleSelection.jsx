import PropTypes from "prop-types";

const RoleSelection = ({ data, onUpdate, onNext, onPrev }) => {
  const roles = [
    {
      value: "admin",
      title: "Administrator",
      description: "Full access to manage organization, users, and all features",
      permissions: [
        "Manage organization settings",
        "Add and remove users", 
        "View all routes and clients",
        "Generate reports and analytics"
      ]
    },
    {
      value: "manager",
      title: "Manager", 
      description: "Manage routes, clients, and team operations",
      permissions: [
        "Create and manage routes",
        "Manage client information",
        "View team analytics",
        "Export route data"
      ]
    },
    {
      value: "user",
      title: "User",
      description: "Create and manage your own routes and clients",
      permissions: [
        "Create personal routes",
        "Manage your clients",
        "View your route history",
        "Export your data"
      ]
    }
  ];

  const handleRoleSelect = (roleValue) => {
    onUpdate({ role: roleValue });
  };

  const handleContinue = () => {
    if (!data.role) {
      return; // Shouldn't happen as default is set
    }
    onNext();
  };

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Choose Your Role
        </h3>
        <p className="text-sm text-gray-600">
          Select the role that best describes your responsibilities in the organization.
        </p>
      </div>

      {/* Role Options */}
      <div className="space-y-4 mb-8">
        {roles.map((role) => (
          <div key={role.value} className="relative">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={data.role === role.value}
                onChange={() => handleRoleSelect(role.value)}
                className="sr-only"
              />
              <div
                className={`border-2 rounded-lg p-4 transition-all ${
                  data.role === role.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        data.role === role.value
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {data.role === role.value && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-base font-medium text-gray-900">
                      {role.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {role.description}
                    </p>
                    <ul className="mt-3 space-y-1">
                      {role.permissions.map((permission, index) => (
                        <li key={index} className="text-xs text-gray-500 flex items-center">
                          <svg className="w-3 h-3 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!data.role}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

RoleSelection.propTypes = {
  data: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};

export default RoleSelection;