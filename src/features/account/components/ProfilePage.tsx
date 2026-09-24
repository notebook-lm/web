import { AtSign, BadgeCheck, Pencil, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthSession } from "@/features/authentication";
import { paths } from "@/routes/config/paths";
import { ProfileDetailRow } from "./ProfileDetailRow";

export function ProfilePage() {
  const { user, isLoading } = useAuthSession();

  if (isLoading || !user) return null;

  const initials = user.displayName.trim().charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet">
          Account settings
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Your profile
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
          Keep your personal details current and manage your workspace identity.
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-black/5 bg-white">
        <div className="relative overflow-hidden bg-[#eaf5f1] px-6 py-7 sm:px-9 sm:py-9">
          <div className="absolute -right-16 -top-20 size-56 rounded-full bg-[#d5ebe4]" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(145deg,#e98766,#c75f55)] text-2xl font-bold text-white sm:size-20 sm:text-3xl">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet">
                  Workspace identity
                </p>
                <h2 className="mt-1 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                  {user.displayName}
                </h2>
                <p className="mt-1 truncate text-sm text-muted">{user.email}</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#b9d8ce] bg-white/80 px-3 py-1.5 text-xs font-bold text-violet">
              <BadgeCheck size={15} />
              Active account
            </span>
          </div>
        </div>

        <section className="p-6 sm:p-9" aria-labelledby="profile-details-title">
          <div>
            <h2 id="profile-details-title" className="text-lg font-bold">
              Personal details
            </h2>
            <p className="mt-1 text-sm text-muted">
              The information associated with your account.
            </p>
          </div>

          <dl className="mt-6 divide-y divide-[#e7eeeb] rounded-2xl border border-[#e7eeeb]">
            <ProfileDetailRow
              label="Account ID"
              icon={<BadgeCheck size={18} />}
              mono
            >
              {user.id}
            </ProfileDetailRow>
            <ProfileDetailRow
              label="Display name"
              icon={<UserRound size={18} />}
            >
              {user.displayName}
            </ProfileDetailRow>
            <ProfileDetailRow label="Email address" icon={<AtSign size={18} />}>
              {user.email}
            </ProfileDetailRow>
          </dl>

          <Link
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet px-4 text-sm font-bold text-white transition hover:bg-violet-deep"
            to={paths.editProfile}
          >
            <Pencil size={16} />
            Edit profile
          </Link>
        </section>
      </section>
    </div>
  );
}
