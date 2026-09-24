import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthSession } from "@/features/authentication";
import { paths } from "@/routes/config/paths";
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
    } catch {
      toast.error("We couldn't update your password. Please try again.");
    }
  };
  const type = visible ? "text" : "password";
  return (
    <div className="min-h-[430px] max-w-[720px] rounded-[15px] bg-white p-5 sm:p-[34px]">
      <header className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-[10px] bg-[#eaf5f1] text-violet">
          <KeyRound size={20} />
        </span>
        <div>
          <p className="text-xs font-bold text-violet">Password</p>
          <h1 className="text-3xl font-semibold">Change password</h1>
          <span className="text-sm text-muted">
            Use a strong, unique password to keep your account secure.
          </span>
        </div>
      </header>
      <div className="mt-7 flex gap-3 rounded-lg bg-[#effaf7] p-3 text-xs text-violet">
        <ShieldCheck size={18} />
        <span>Updating your password signs you out on every device.</span>
      </div>
      <form
        className="mt-7 grid max-w-[480px] gap-3 [&>label]:text-xs [&>label]:font-bold"
        onSubmit={handleSubmit(submit)}
      >
        <label htmlFor="current-account-password">Current password</label>
        <input
          id="current-account-password"
          className="min-h-11 rounded-lg bg-[#f7f9f7] px-3"
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
        <div className="flex min-h-11 items-center rounded-lg bg-[#f7f9f7] px-3">
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
          <p className="text-xs text-[#b64034]">{errors.newPassword.message}</p>
        )}
        <label htmlFor="confirm-account-password">Confirm new password</label>
        <div className="flex min-h-11 items-center rounded-lg bg-[#f7f9f7] px-3">
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
              confirmVisible ? "Hide confirmation password" : "Show confirmation password"
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
          className="mt-4 rounded-lg bg-violet px-4 py-3 text-sm font-bold text-white disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
