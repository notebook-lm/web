import type { User } from "../model";

export const permissions = [
  "user:self:read",
  "user:self:update",
  "user:self:email:update",
  "user:self:password:update",
  "user:self:delete",
] as const;

export type Permission = (typeof permissions)[number];

type PermissionMode = "all" | "any";

export function resolvePermissions(user: User | null): Permission[] {
  return user ? [...permissions] : [];
}

export function hasPermissions(
  granted: Permission[],
  required: Permission[],
  mode: PermissionMode = "all",
) {
  return mode === "all"
    ? required.every((permission) => granted.includes(permission))
    : required.some((permission) => granted.includes(permission));
}
