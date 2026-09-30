export const paths = {
  home: "/",
  signIn: "/login",
  signUp: "/register",
  legacyAuth: "/auth",
  workspace: "/app",
  newProject: "/app/projects/new",
  project: "/app/projects/:projectId",
  profile: "/profile",
  editProfile: "/profile/edit",
  changeEmail: "/profile/change-email",
  changePassword: "/profile/change-password",
  deleteAccount: "/profile/delete-account",
} as const;
