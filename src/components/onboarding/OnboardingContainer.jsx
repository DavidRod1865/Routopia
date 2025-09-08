import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useUserOnboarding from "../hooks/useUserOnboarding";
import OrganizationSetup from "./OrganizationSetup";
import RoleSelection from "./RoleSelection";
import OnboardingComplete from "./OnboardingComplete";

const OnboardingContainer = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const { completeOnboarding } = useUserOnboarding();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    organizationName: "",
    createNewOrganization: true,
    role: "user"
  });

  const totalSteps = 3;

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const updateOnboardingData = (data) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      await completeOnboarding(onboardingData);
      
      // Move to completion step
      setCurrentStep(totalSteps + 1);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (err) {
      // Error is handled by the hook and toast system
      console.error("Onboarding completion error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <OrganizationSetup
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <RoleSelection
            data={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 3:
        return (
          <OnboardingComplete
            data={onboardingData}
            onComplete={handleComplete}
            onPrev={handlePrev}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Setting up your account...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Routopia
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hi {user?.name || user?.email}! Let's get your account set up.
          </p>
        </div>

        {/* Progress Indicator */}
        {currentStep <= totalSteps && (
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step < currentStep
                      ? "bg-green-500 text-white"
                      : step === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step < currentStep ? "✓" : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Labels */}
        {currentStep <= totalSteps && (
          <div className="flex justify-between text-xs text-gray-500 px-2">
            <span className={currentStep === 1 ? "font-medium text-blue-600" : ""}>
              Organization
            </span>
            <span className={currentStep === 2 ? "font-medium text-blue-600" : ""}>
              Role
            </span>
            <span className={currentStep === 3 ? "font-medium text-blue-600" : ""}>
              Review
            </span>
          </div>
        )}

        {/* Step Content */}
        <div className="mt-8 space-y-6">
          {getStepComponent()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;