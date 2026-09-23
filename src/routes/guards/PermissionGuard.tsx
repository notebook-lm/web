import { Outlet } from "react-router-dom";
import {
  hasPermissions,
  type Permission,
  useAuthSession,
} from "@/features/authentication";
import { AccessDenied } from "../layouts/AccessDenied";

interface PermissionGuardProps {
  required: Permission[];
  mode?: "all" | "any";
}

export function PermissionGuard({
  required,
  mode = "all",
}: PermissionGuardProps) {
  const { permissions } = useAuthSession();
  return hasPermissions(permissions, required, mode) ? (
    <Outlet />
  ) : (
    <AccessDenied />
  );
}
