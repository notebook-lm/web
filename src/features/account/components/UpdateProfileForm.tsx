import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthSession } from "@/features/authentication";
import { paths } from "@/routes/config/paths";
import {
  updateProfileSchema,
  type UpdateProfileValues,
} from "@/shared/utils/validators";
import { useUpdateProfile } from "../hooks/mutations/useAccountMutations";

export function UpdateProfileForm() {
  const { user } = useAuthSession();
  const navigate = useNavigate();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
  });
  useEffect(() => {
    if (user) reset({ displayName: user.displayName });
  }, [reset, user]);
  if (!user) return null;
  const submit = async (values: UpdateProfileValues) => {
    try {
      await updateProfile(values);
      toast.success("Profile information saved.");
      navigate(paths.profile);
    } catch {
      toast.error("We couldn't save your profile. Please try again.");
    }
  };
  return (
    <div className="min-h-[430px] max-w-[720px] rounded-[15px] bg-white p-5 sm:p-[34px]">
      <Link
        className="mb-6 inline-flex items-center gap-2 text-xs font-extrabold text-muted hover:text-violet"
        to={paths.profile}
      >
        <ArrowLeft size={16} />
        Back to profile
      </Link>
      <header className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-[10px] bg-[#eaf5f1] text-violet">
          <UserRound size={20} />
        </span>
        <div>
          <p className="text-xs font-bold text-violet">Profile</p>
          <h1 className="text-3xl font-semibold">Edit personal information</h1>
        </div>
      </header>
      <form className="mt-8 max-w-[480px]" onSubmit={handleSubmit(submit)}>
        <label htmlFor="profile-display-name">Display name</label>
        <input
          className="mt-2 min-h-11 w-full rounded-lg bg-[#f4f7f4] px-3 text-sm outline-none"
          id="profile-display-name"
          autoFocus
          {...register("displayName")}
        />
        {errors.displayName ? (
          <p className="mt-2 text-xs text-[#b64034]">
            {errors.displayName.message}
          </p>
        ) : (
          <p className="mt-2 text-[11px] text-[#89948f]">
            Use the name you want collaborators to recognize.
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            className="rounded-lg bg-violet px-4 py-3 text-sm font-bold text-white disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
          <Link
            className="rounded-lg bg-[#eff8f5] px-4 py-3 text-sm font-bold text-violet"
            to={paths.profile}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
