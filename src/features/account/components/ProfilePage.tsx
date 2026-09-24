import { AtSign, BadgeCheck, Pencil, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/routes/config/paths";
import { useAuthSession } from "@/features/authentication";
import { ProfileDetailRow } from "./ProfileDetailRow";

export function ProfilePage() {
  const { user, isLoading } = useAuthSession();
  if (isLoading) return null;
  if (!user) return null;
  return (
    <div className="min-h-[430px] max-w-[720px] rounded-[15px] bg-white p-5 sm:p-[34px]">
      <header className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#eaf5f1] text-violet">
          <UserRound size={20} />
        </span>
        <div>
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[.08em] text-violet">
            Profile
          </p>
          <h1 className="m-0 text-[clamp(26px,3vw,34px)] font-semibold leading-[1.1] tracking-[-1.2px]">
            Personal information
          </h1>
          <span className="mt-2 block text-[13px] leading-relaxed text-muted">
            Review the details shown throughout your workspace.
          </span>
        </div>
      </header>
      <section
        className="mt-[31px] grid gap-1 rounded-[10px] bg-[#f6f8f6] p-2"
        aria-label="Profile details"
      >
        <ProfileDetailRow
          label="Display name"
          highlighted
          icon={user.displayName.charAt(0).toUpperCase()}
        >
          <strong className="text-[13px]">{user.displayName}</strong>
        </ProfileDetailRow>
        <ProfileDetailRow label="Account ID" icon={<BadgeCheck size={16} />}>
          <strong className="truncate font-mono text-[10px] font-medium text-[#78847e]">
            {user.id}
          </strong>
        </ProfileDetailRow>
        <ProfileDetailRow label="Email address" icon={<AtSign size={16} />}>
          <strong className="truncate text-[13px]">{user.email}</strong>
        </ProfileDetailRow>
      </section>
      <div className="mt-6 flex">
        <Link
          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-violet px-4 text-sm font-bold text-white transition hover:bg-violet-deep"
          to={paths.editProfile}
        >
          <Pencil size={16} />
          Edit profile
        </Link>
      </div>
    </div>
  );
}
