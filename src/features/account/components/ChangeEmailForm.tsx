import { Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/config/paths";
import { toast } from "sonner";
import { useAuthSession } from "@/features/authentication";
import { useChangeEmail } from "../hooks/mutations/useAccountMutations";
import {
  changeEmailSchema,
  type ChangeEmailValues,
} from "@/shared/utils/validators";

export function ChangeEmailForm() {
  const { mutateAsync: changeEmail } = useChangeEmail();
  const { user, clearAuth } = useAuthSession();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
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
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="min-h-[430px] max-w-[720px] rounded-[15px] bg-white p-5 sm:p-[34px]">
      <header className="flex items-start gap-3 [&>div>p]:mb-1 [&>div>p]:text-[11px] [&>div>p]:font-extrabold [&>div>p]:uppercase [&>div>p]:tracking-[.08em] [&>div>p]:text-violet [&>div>h1]:m-0 [&>div>h1]:text-[clamp(26px,3vw,34px)] [&>div>h1]:font-semibold [&>div>h1]:leading-[1.1] [&>div>span]:mt-2 [&>div>span]:block [&>div>span]:text-[13px] [&>div>span]:leading-relaxed [&>div>span]:text-muted">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#eaf5f1] text-violet">
          <Mail size={20} />
        </span>
        <div>
          <p>Email</p>
          <h1>Change email address</h1>
          <span>Your current address is {user.email}.</span>
        </div>
      </header>
      <div className="mt-7 flex items-start gap-3 rounded-lg bg-[#effaf7] p-3 text-xs leading-relaxed text-violet">
        <ShieldCheck size={18} />
        <span>
          For your security, changing your email signs you out on every device.
        </span>
      </div>
      <form
        className="mt-7 grid max-w-[480px] gap-3 [&>label]:text-xs [&>label]:font-bold [&>label]:text-[#485752] [&>input]:min-h-11 [&>input]:rounded-lg [&>input]:bg-[#f7f9f7] [&>input]:px-3 [&>input]:text-sm [&>input]:outline-none"
        onSubmit={handleSubmit(submit)}
      >
        <label htmlFor="account-email">New email address</label>
        <input
          id="account-email"
          type="email"
          autoFocus
          {...register("email")}
        />
        <label htmlFor="email-password">Current password</label>
        <input
          id="email-password"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="text-xs text-[#b64034]">
            {errors.currentPassword.message}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <button
            className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-violet px-4 text-sm font-bold text-white hover:bg-violet-deep disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating…" : "Update email"}
          </button>
        </div>
      </form>
    </div>
  );
}
