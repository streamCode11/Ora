import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";

const ProtectedRoute = ({ children }) => {
  const [auth] = useAuth();
  const location = useLocation();

  if (auth.loading) {
    return <div>Loading...</div>; 
  }

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;