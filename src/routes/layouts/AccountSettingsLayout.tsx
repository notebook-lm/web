import { Outlet } from "react-router-dom";
import { useAuthSession } from "@/features/authentication";
import { AccountSettingsNavigation } from "@/features/account";

export function AccountSettingsLayout() {
  const { user } = useAuthSession();
  if (!user) return null;
  return (
    <section className="grid items-start gap-[26px] md:grid-cols-[270px_minmax(0,1fr)]">
      <aside className="rounded-[14px] bg-white p-3 md:p-[18px]">
        <div className="hidden items-center gap-3 px-2 py-2 pb-5 md:flex">
          <span className="grid size-[38px] shrink-0 place-items-center rounded-full bg-[linear-gradient(145deg,#e98766,#c75f55)] text-sm font-extrabold text-white">
            {user.displayName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <strong className="block truncate text-[13px]">
              {user.displayName}
            </strong>
            <small className="mt-0.5 block max-w-40 truncate text-[10px] text-muted">
              {user.email}
            </small>
          </div>
        </div>
        <AccountSettingsNavigation />
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </section>
  );
}
