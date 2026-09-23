import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  ChangeEmailForm,
  ChangePasswordForm,
  DeleteAccountForm,
  ProfilePage,
  UpdateProfileForm,
} from "@/features/account";
import { permissions } from "@/features/authentication";
import { RouteLoading } from "@/shared/components";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { PermissionGuard } from "./guards/PermissionGuard";
import { AccountSettingsLayout } from "./layouts/AccountSettingsLayout";
import { AppLayout } from "./layouts/AppLayout";
import { paths } from "./paths";

const AuthenticationLayout = lazy(() =>
  import("./layouts/AuthenticationLayout").then(
    ({ AuthenticationLayout: Component }) => ({
      default: Component,
    }),
  ),
);

const LandingPage = lazy(() =>
  import("@/features/landing").then(({ LandingPage: Component }) => ({
    default: Component,
  })),
);

const WorkspacePage = lazy(() =>
  import("@/features/workspace").then(({ WorkspacePage: Component }) => ({
    default: Component,
  })),
);

export function AppRouter() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path={paths.home} element={<LandingPage />} />
        <Route element={<GuestGuard />}>
          <Route
            path={paths.signIn}
            element={<AuthenticationLayout mode="login" />}
          />
          <Route
            path={paths.signUp}
            element={<AuthenticationLayout mode="register" />}
          />
        </Route>
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path={paths.workspace} element={<WorkspacePage />} />
            <Route element={<AccountSettingsLayout />}>
              <Route element={<PermissionGuard required={[permissions[0]]} />}>
                <Route path={paths.profile} element={<ProfilePage />} />
              </Route>
              <Route element={<PermissionGuard required={[permissions[1]]} />}>
                <Route
                  path={paths.editProfile}
                  element={<UpdateProfileForm />}
                />
              </Route>
              <Route element={<PermissionGuard required={[permissions[2]]} />}>
                <Route path={paths.changeEmail} element={<ChangeEmailForm />} />
              </Route>
              <Route element={<PermissionGuard required={[permissions[3]]} />}>
                <Route
                  path={paths.changePassword}
                  element={<ChangePasswordForm />}
                />
              </Route>
              <Route element={<PermissionGuard required={[permissions[4]]} />}>
                <Route
                  path={paths.deleteAccount}
                  element={<DeleteAccountForm />}
                />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route
          path={paths.legacyAuth}
          element={<Navigate to={paths.signIn} replace />}
        />
        <Route path="*" element={<Navigate to={paths.home} replace />} />
      </Routes>
    </Suspense>
  );
}
