import type { ReactNode } from "react";
import { useSessionBootstrap } from "../hooks/useSessionBootstrap";

export interface AuthSessionProviderProps {
  children: ReactNode;
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  useSessionBootstrap();
  return <>{children}</>;
}
