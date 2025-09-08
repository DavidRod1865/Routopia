import { useState } from "react";
import PropTypes from "prop-types";
import useUserOnboarding from "../hooks/useUserOnboarding";

const OrganizationSetup = ({ data, onUpdate, onNext }) => {
  const { verifyOrganization } = useUserOnboarding();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [organizationName, setOrganizationName] = useState(data.organizationName || "");
  const [createNewOrganization, setCreateNewOrganization] = useState(data.createNewOrganization ?? true);

  const handleVerifyAndNext = async () => {
    if (!organizationName.trim()) {
      setVerificationError("Please enter an organization name");
      return;
    }

    if (createNewOrganization) {
      // Creating new organization - no verification needed
      onUpdate({
        organizationName: organizationName.trim(),
        createNewOrganization: true
      });
      onNext();
      return;
    }

    // Verify existing organization
    try {
      setIsVerifying(true);
      setVerificationError("");

      const existingOrg = await verifyOrganization(organizationName.trim());
      
      if (!existingOrg) {
        setVerificationError(`Organization "${organizationName}" not found. Please check the name or create a new organization instead.`);
        return;
      }

      // Organization verified - proceed to next step
      onUpdate({
        organizationName: organizationName.trim(),
        createNewOrganization: false
      });
      onNext();

    } catch (err) {
      setVerificationError("Failed to verify organization. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOrganizationNameChange = (e) => {
    setOrganizationName(e.target.value);
    setVerificationError(""); // Clear error when user types
  };

  const handleModeChange = (isCreatingNew) => {
    setCreateNewOrganization(isCreatingNew);
    setVerificationError(""); // Clear error when switching modes
  };

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Organization Setup
        </h3>
        <p className="text-sm text-gray-600">
          Join an existing organization or create a new one for your team.
        </p>
      </div>

      {/* Organization Mode Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="orgMode"
              checked={createNewOrganization}
              onChange={() => handleModeChange(true)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Create new organization</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="orgMode"
              checked={!createNewOrganization}
              onChange={() => handleModeChange(false)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Join existing organization</span>
          </label>
        </div>
      </div>

      {/* Organization Name Input */}
      <div className="mb-6">
        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
          Organization Name
        </label>
        <input
          type="text"
          id="organizationName"
          value={organizationName}
          onChange={handleOrganizationNameChange}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            verificationError ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={createNewOrganization ? "Enter your new organization name" : "Enter existing organization name"}
          disabled={isVerifying}
        />
        
        {/* Help text */}
        <p className="mt-2 text-xs text-gray-500">
          {createNewOrganization 
            ? "You'll become the admin of this new organization."
            : "You must know the exact name of the organization to join it."
          }
        </p>

        {/* Error message */}
        {verificationError && (
          <p className="mt-2 text-sm text-red-600">
            {verificationError}
          </p>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleVerifyAndNext}
        disabled={isVerifying || !organizationName.trim()}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isVerifying ? (
          <div className="flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Verifying...
          </div>
        ) : (
          createNewOrganization ? "Create & Continue" : "Verify & Continue"
        )}
      </button>
    </div>
  );
};

OrganizationSetup.propTypes = {
  data: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default OrganizationSetup;