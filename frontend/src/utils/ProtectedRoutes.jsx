import { Navigate } from "react-router-dom";


export const ProtectedRoutes = ({ children }) => {
  const userEmail = localStorage.getItem("userEmail");
  const userToken = localStorage.getItem("user");
  
  if (!userEmail || !userToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}