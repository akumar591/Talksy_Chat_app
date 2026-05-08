import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
}) {

  const {
    user,
    authLoading,
  } = useAuth();

  // 🔥 WAIT AUTH
  if (authLoading) {

    return (
      <div className="h-screen flex items-center justify-center bg-[#0b0f1a] text-white">
        Loading...
      </div>
    );
  }

  // 🔥 NOT LOGGED IN
  if (!user) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;