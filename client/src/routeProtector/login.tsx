// ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";

const LoginProtectedRoute = () => {
  const token = localStorage.getItem("isLogin");
  return !token ? <Outlet /> : <Navigate to="/chat" replace={true} />;
};

export default LoginProtectedRoute;
