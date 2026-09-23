import { Navigate, Outlet } from "react-router-dom";
import { paths } from "../paths";
import { useAuthSession } from "@/features/authentication";
import { RouteLoading } from "@/shared/components";

export function GuestGuard() {
  const { user, isLoading } = useAuthSession();
  if (isLoading) return <RouteLoading />;
  return user ? <Navigate to={paths.workspace} replace /> : <Outlet />;
}
