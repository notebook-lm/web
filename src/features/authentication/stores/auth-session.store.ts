"use client";

import { create } from "zustand";
import type { AuthSession } from "../model";
import { clearSession, getSession, saveSession } from "../storage/session.storage";

interface AuthSessionState {
  hasSession: boolean;
  setSession: (session: AuthSession) => void;
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
