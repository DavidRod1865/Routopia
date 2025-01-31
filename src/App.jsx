import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Landing from "./pages/Landing";
import RouteManager from "./routeManager/pages/RouteManager";
import PrivateRoute from "./auth_components/PrivateRoute";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<PrivateRoute><RouteManager /></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default App;
