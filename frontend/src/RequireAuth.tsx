import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./state/AuthContext";

type RequireAuthProps = { children: JSX.Element };

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While we’re still checking localStorage token + /auth/me,
  // do NOT redirect. Show nothing or a spinner.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ reason: "auth_required", from: location.pathname }}
      />
    );
  }

  return children;
}
