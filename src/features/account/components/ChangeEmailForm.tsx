import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthSession } from "@/features/authentication";
import { paths } from "@/routes/config/paths";
import { getErrorMessage, setApiFieldErrors } from "@/shared/errors/error-message";
import {
  changeEmailSchema,
  type ChangeEmailValues,
} from "@/shared/utils/validators";
import { useChangeEmail } from "../hooks/mutations/useAccountMutations";

export function ChangeEmailForm() {
  const { mutateAsync: changeEmail } = useChangeEmail();
  const { user, clearAuth } = useAuthSession();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: user?.email ?? "", currentPassword: "" },
  });

  if (!user) return null;

  const submit = async (values: ChangeEmailValues) => {
    try {
      await changeEmail(values);
      clearAuth();
      toast.success("Email updated. Please sign in again.");
      navigate(paths.signIn, { replace: true });
    } catch (error) {
      if (setApiFieldErrors(error, ["email", "currentPassword"] as const, setError)) return;
      toast.error(getErrorMessage(error, "We couldn't update your email. Please try again."));
    }
  };

  return (
    <div className="max-w-3xl">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet">
          Account settings
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Change email address
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
          Update the email you use to sign in to your workspace.
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-black/5 bg-white">
        <div className="flex items-start gap-4 border-b border-[#e7eeeb] bg-[#eaf5f1] px-6 py-6 sm:px-9">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-violet">
            <Mail size={20} />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold">Sign-in email</h2>
            <p className="mt-1 truncate text-sm text-muted">
              Current: {user.email}
            </p>
          </div>
        </div>

        <div className="max-w-2xl p-6 sm:p-9">
          <div className="flex gap-3 rounded-xl border border-[#d7e9e3] bg-[#eff8f5] p-3 text-xs leading-5 text-[#47655c]">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-violet" />
            Changing your email signs you out on every device.
          </div>

          <form className="mt-7 grid gap-5" onSubmit={handleSubmit(submit)}>
            <div className="grid gap-2">
              <label
                className="text-xs font-bold text-[#485752]"
                htmlFor="account-email"
              >
                New email address
              </label>
              <input
                id="account-email"
                className="min-h-12 rounded-xl border border-[#e1e9e5] bg-[#f8faf8] px-4 text-sm outline-none transition focus:border-[#b9d8ce] focus:bg-white"
                type="email"
                autoFocus
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-[#b64034]">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label
                className="text-xs font-bold text-[#485752]"
                htmlFor="email-password"
              >
                Current password
              </label>
              <input
                id="email-password"
                className="min-h-12 rounded-xl border border-[#e1e9e5] bg-[#f8faf8] px-4 text-sm outline-none transition focus:border-[#b9d8ce] focus:bg-white"
                type="password"
                autoComplete="current-password"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-xs text-[#b64034]">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="flex pt-1">
              <button
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet px-4 text-sm font-bold text-white transition hover:bg-violet-deep disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating…" : "Update email"}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
