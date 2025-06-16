import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import { useAuth } from "./AuthContext";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
