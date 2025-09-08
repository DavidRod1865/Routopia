import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PrivateRoute from "./auth_components/PrivateRoute";
import Product from "./pages/Product";
import Landing from "./pages/Landing";
import ManagementDashboard from "./pages/management/ManagementDashboard";
import OnboardingContainer from "./components/onboarding/OnboardingContainer";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isLoading, isAuthenticated]); // Do not add navigate to dependencies because it causes infinite loop

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<OnboardingContainer />} />
          <Route path="/dashboard/*" element={<PrivateRoute><ManagementDashboard /></PrivateRoute>} />
          <Route path="/product" element={<Product />} />
        </Routes>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
};

export default App;
