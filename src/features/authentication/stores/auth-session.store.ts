"use client";

import { create } from "zustand";
import type { AuthResponse } from "@/shared/types/authentication";
import { clearSession, getSession, saveSession } from "../session.storage";

interface AuthSessionState {
  hasSession: boolean;
  setSession: (session: AuthResponse) => void;
  reset: () => void;
}

const initialSessionState = {
  hasSession: getSession() !== null,
};

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  ...initialSessionState,
  setSession: (session) => {
    saveSession(session);
    set({ hasSession: true });
  },
  reset: () => {
    clearSession();
    set({ hasSession: false });
  },
}));
