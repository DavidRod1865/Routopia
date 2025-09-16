import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./auth_components/PrivateRoute";
import Product from "./pages/Product";
import Landing from "./pages/Landing";
import ManagementDashboard from "./pages/management/ManagementDashboard";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

const App = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard/*" element={<PrivateRoute><ManagementDashboard /></PrivateRoute>} />
          <Route path="/product" element={<Product />} />
        </Routes>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
};

export default App;
