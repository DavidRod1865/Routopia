import { BrowserRouter as Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Landing from "./pages/Landing";
import RouteManager from "./routeManager/pages/RouteManager";

const App = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, prompt login
      if (!isAuthenticated) {
        loginWithRedirect();
      }
      // If authenticated, go straight to "/dashboard"
      else {
        navigate("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Public landing route (if user happens to visit "/") */}
        <Route path="/" element={<Landing />} />

        {/* Dashboard route (RouteManager) */}
        <Route path="/dashboard" element={<RouteManager />} />
      </Routes>
    </div>
  );
};

export default App;