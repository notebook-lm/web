import { AlertTriangle, Check, ShieldAlert, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/config/paths";
import { getErrorMessage, setApiFieldErrors } from "@/shared/errors/error-message";
import { toast } from "sonner";
import { useAuthSession } from "@/features/authentication";
import { useDeleteAccount } from "../hooks/mutations/useAccountMutations";
import {
  deleteAccountSchema,
  type DeleteAccountValues,
} from "@/shared/utils/validators";

export function DeleteAccountForm() {
  const { mutateAsync: deleteAccount } = useDeleteAccount();
  const { clearAuth } = useAuthSession();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { currentPassword: "" },
  });
  const submit = async (values: DeleteAccountValues) => {
    try {
      await deleteAccount({ currentPassword: values.currentPassword });
      clearAuth();
      toast.success("Your account has been deleted.");
      navigate(paths.signUp, { replace: true });
    } catch (error) {
      if (setApiFieldErrors(error, ["currentPassword"] as const, setError)) return;
      toast.error(getErrorMessage(error, "We couldn't delete your account. Please try again."));
    }
  };
  return (
    <div className="min-h-[430px] max-w-[720px] rounded-[15px] bg-white p-5 sm:p-[34px]">
      <header className="flex items-start gap-3 [&>div>p]:mb-1 [&>div>p]:text-[11px] [&>div>p]:font-extrabold [&>div>p]:uppercase [&>div>p]:tracking-[.08em] [&>div>p]:text-violet [&>div>h1]:m-0 [&>div>h1]:text-[clamp(26px,3vw,34px)] [&>div>h1]:font-semibold [&>div>h1]:leading-[1.1] [&>div>span]:mt-2 [&>div>span]:block [&>div>span]:text-[13px] [&>div>span]:leading-relaxed [&>div>span]:text-muted">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#fff1ef] text-[#b64034]">
          <ShieldAlert size={20} />
        </span>
        <div>
          <p>Danger zone</p>
          <h1>Delete account</h1>
          <span>This permanently removes your NotebookLM account.</span>
        </div>
      </header>
      <div className="mt-7 flex gap-3 rounded-lg bg-[#fff5f3] p-4 text-xs leading-relaxed text-[#7b423b] [&_ul]:mt-3 [&_ul]:grid [&_ul]:gap-2 [&_ul]:p-0 [&_li]:flex [&_li]:items-center [&_li]:gap-2">
        <AlertTriangle size={20} />
        <div>
          <strong>This action cannot be undone.</strong>
          <ul>
            <li>
              <Check size={14} />
              Your profile information will be permanently deleted.
            </li>
            <li>
              <Check size={14} />
              Every active session will end immediately.
            </li>
            <li>
              <Check size={14} />
              You will lose access to this workspace.
            </li>
          </ul>
        </div>
      </div>
      <form
        className="mt-7 grid w-full gap-3 [&>label]:text-xs [&>label]:font-bold [&>label]:text-[#485752] [&>input]:min-h-11 [&>input]:rounded-lg [&>input]:bg-[#f7f9f7] [&>input]:px-3 [&>input]:text-sm [&>input]:outline-none"
        onSubmit={handleSubmit(submit)}
      >
        <label htmlFor="delete-account-password">
          Enter your password to continue
        </label>
        <input
          id="delete-account-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="text-xs text-[#b64034]">
            {errors.currentPassword.message}
          </p>
        )}
        <div className="mt-4 flex">
          <button
            className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#b64034] px-4 text-sm font-bold text-white hover:bg-[#913026] disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting…" : "Delete account"}
            <Trash2 size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
