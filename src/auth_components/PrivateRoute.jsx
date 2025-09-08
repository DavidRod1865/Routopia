import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import propTypes from "prop-types";
import useUserOnboarding from "../components/hooks/useUserOnboarding";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const { needsOnboarding, isLoading: onboardingLoading } = useUserOnboarding();

  // Show loading while checking authentication or onboarding status
  if (authLoading || onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to landing
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Authenticated but needs onboarding - redirect to onboarding
  if (needsOnboarding) {
    return <Navigate to="/onboarding" />;
  }

  // Authenticated and onboarded - allow access
  return children;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: propTypes.node.isRequired,
};
