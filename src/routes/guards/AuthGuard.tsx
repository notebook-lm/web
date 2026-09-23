import { Navigate, Outlet, useLocation } from "react-router-dom";
import { paths } from "../paths";
import { useAuthSession } from "@/features/authentication";
import { RouteLoading } from "@/shared/components";

export function AuthGuard() {
  const { user, isLoading } = useAuthSession();
  const location = useLocation();
  if (isLoading) return <RouteLoading />;
  return user ? (
    <Outlet />
  ) : (
    <Navigate to={paths.signIn} replace state={{ from: location }} />
  );
}
