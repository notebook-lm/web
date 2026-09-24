import {
  AlertTriangle,
  KeyRound,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { paths } from "@/routes/config/paths";

export type AccountSettingsNavigationItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  dangerous?: boolean;
  end?: boolean;
};

export const accountSettingsNavigation: AccountSettingsNavigationItem[] = [
  { label: "Profile", to: paths.profile, icon: UserRound, end: true },
  { label: "Email", to: paths.changeEmail, icon: Mail },
  { label: "Password", to: paths.changePassword, icon: KeyRound },
  {
    label: "Delete account",
    to: paths.deleteAccount,
    icon: AlertTriangle,
    dangerous: true,
  },
];
