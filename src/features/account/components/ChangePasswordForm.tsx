import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthSession } from "@/features/authentication";
import { paths } from "@/routes/config/paths";
import { getErrorMessage } from "@/shared/errors/error-message";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/shared/utils/validators";
import { useChangePassword } from "../hooks/mutations/useAccountMutations";

export function ChangePasswordForm() {
  const { clearAuth } = useAuthSession();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { mutateAsync: changePassword } = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const submit = async ({
    confirmPassword,
    ...values
  }: ChangePasswordValues) => {
    void confirmPassword;
    try {
      await changePassword(values);
      clearAuth();
      toast.success("Password updated. Please sign in again.");
      navigate(paths.signIn, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't update your password. Please try again."));
    }
  };
  const type = visible ? "text" : "password";
  return (
    <div className="max-w-3xl">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet">
          Account settings
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Change password
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
          Use a strong, unique password to keep your workspace secure.
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-black/5 bg-white">
        <div className="flex items-start gap-4 border-b border-[#e7eeeb] bg-[#eaf5f1] px-6 py-6 sm:px-9">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-violet">
            <KeyRound size={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold">Password security</h2>
            <p className="mt-1 text-sm text-muted">
              Choose a password only you know.
            </p>
          </div>
        </div>

        <div className="max-w-2xl p-6 sm:p-9">
          <form
            className="mt-7 grid gap-5 [&_label]:text-xs [&_label]:font-bold [&_label]:text-[#485752]"
            onSubmit={handleSubmit(submit)}
          >
            <label htmlFor="current-account-password">Current password</label>
            <input
              id="current-account-password"
              className="min-h-12 rounded-xl border border-[#e1e9e5] bg-[#f8faf8] px-4 outline-none transition focus:border-[#b9d8ce] focus:bg-white"
              type={type}
              autoComplete="current-password"
              autoFocus
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-xs text-[#b64034]">
                {errors.currentPassword.message}
              </p>
            )}
            <label htmlFor="new-account-password">New password</label>
            <div className="flex min-h-12 items-center rounded-xl border border-[#e1e9e5] bg-[#f8faf8] px-4 transition focus-within:border-[#b9d8ce] focus-within:bg-white">
              <input
                id="new-account-password"
                className="min-w-0 flex-1 bg-transparent outline-none"
                type={type}
                autoComplete="new-password"
                {...register("newPassword")}
              />
              <button
                type="button"
                aria-label={visible ? "Hide passwords" : "Show passwords"}
                onClick={() => setVisible((value) => !value)}
              >
                {visible ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-[#b64034]">
                {errors.newPassword.message}
              </p>
            )}
            <label htmlFor="confirm-account-password">
              Confirm new password
            </label>
            <div className="flex min-h-12 items-center rounded-xl border border-[#e1e9e5] bg-[#f8faf8] px-4 transition focus-within:border-[#b9d8ce] focus-within:bg-white">
              <input
                id="confirm-account-password"
                className="min-w-0 flex-1 bg-transparent outline-none"
                type={confirmVisible ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                aria-label={
                  confirmVisible
                    ? "Hide confirmation password"
                    : "Show confirmation password"
                }
                onClick={() => setConfirmVisible((value) => !value)}
              >
                {confirmVisible ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="text-xs text-[#b64034]">
                {errors.confirmPassword.message}
              </p>
            ) : (
              <p className="text-[11px] text-[#89948f]">
                Use between 8 and 72 characters.
              </p>
            )}
            <button
              className="mt-1 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet px-4 text-sm font-bold text-white transition hover:bg-violet-deep disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating…" : "Update password"}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
