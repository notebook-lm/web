import { NavLink } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { accountSettingsNavigation } from "./account-settings-navigation";

const baseClass =
  "flex h-10 items-center gap-2 rounded-lg px-2.5 text-xs font-bold text-[#68746f] transition hover:bg-[#f1f8f5] hover:text-violet";

export function AccountSettingsNavigation() {
  return (
    <nav
      className="flex gap-1 overflow-x-auto md:grid"
      aria-label="Account settings"
    >
      {accountSettingsNavigation.map(
        ({ label, to, icon: Icon, dangerous, end }) => (
          <NavLink
            end={end}
            to={to}
            key={to}
            className={({ isActive }) =>
              cn(
                baseClass,
                "shrink-0",
                dangerous &&
                  "mt-0 text-[#a04d43] hover:bg-[#fff1ef] hover:text-[#b64034] md:mt-2.5",
                isActive &&
                  (dangerous
                    ? "bg-[#fff1ef] text-[#b64034]"
                    : "bg-[#eaf5f1] text-violet"),
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ),
      )}
    </nav>
  );
}
