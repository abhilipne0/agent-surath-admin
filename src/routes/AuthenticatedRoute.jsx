import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthenticatedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    } else if (role === "agent") {
      // Define allowed routes for agent
      const allowedRoutes = [
        "/agent/dashboard",
        "/agent/user",
        "/agent/transaction"
      ];

      const isAllowed =
        allowedRoutes.includes(location.pathname) ||
        location.pathname.startsWith("/agent/transaction/") || // agent transaction
        location.pathname.startsWith("/user/transaction/");   // user transaction

      if (!isAllowed) {
        navigate("/agent/dashboard", { replace: true });
      }
    }
  }, [token, role, navigate, location.pathname]);


  return children;
};

export default AuthenticatedRoute;
