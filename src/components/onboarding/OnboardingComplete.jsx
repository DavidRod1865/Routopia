import PropTypes from "prop-types";

const OnboardingComplete = ({ data, onComplete, onPrev, isSubmitting }) => {
  const getRoleDisplayName = (role) => {
    const roleMap = {
      admin: "Administrator",
      manager: "Manager",
      user: "User"
    };
    return roleMap[role] || role;
  };

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Review & Complete
        </h3>
        <p className="text-sm text-gray-600">
          Please review your information before completing the setup.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Setup Summary</h4>
        
        <div className="space-y-3">
          {/* Organization */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">Organization:</span>
              <p className="text-sm text-gray-900">{data.organizationName}</p>
              <p className="text-xs text-gray-500">
                {data.createNewOrganization ? "Creating new organization" : "Joining existing organization"}
              </p>
            </div>
            <div className="flex-shrink-0">
              {data.createNewOrganization ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  New
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Existing
                </span>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">Role:</span>
              <p className="text-sm text-gray-900">{getRoleDisplayName(data.role)}</p>
              <p className="text-xs text-gray-500">
                {data.role === 'admin' && "Full administrative access"}
                {data.role === 'manager' && "Team and operations management"}
                {data.role === 'user' && "Personal route and client management"}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                data.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                data.role === 'manager' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getRoleDisplayName(data.role)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Your account will be created with the selected role
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {data.createNewOrganization 
              ? "Your organization will be created and you'll be the admin"
              : "You'll be added to the existing organization"
            }
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            You'll be redirected to your dashboard to start using Routopia
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Setting up...
            </div>
          ) : (
            "Complete Setup"
          )}
        </button>
      </div>
    </div>
  );
};

OnboardingComplete.propTypes = {
  data: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default OnboardingComplete;