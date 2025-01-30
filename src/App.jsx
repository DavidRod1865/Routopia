import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Landing from "./pages/Landing";
import PrivateRoute from "./auth_components/PrivateRoute";
import RouteManager from "./routeManager/pages/RouteManager";

const App = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Landing />} />

          {/* Private Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <RouteManager />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
