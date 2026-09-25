import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSignUp } from "@/features/authentication";
import { paths } from "@/routes/config/paths";
import { getErrorMessage } from "@/shared/errors/error-message";
import { signUpSchema, type SignUpValues } from "@/shared/utils/validators";

const field =
  "flex min-h-[46px] items-center gap-2 rounded-lg bg-[#f4f7f4] px-3 text-[#7b8985]";

export function SignUpForm() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { mutateAsync: signUp } = useSignUp();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const submit = async (values: SignUpValues) => {
    const payload = {
      displayName: values.displayName,
      email: values.email,
      password: values.password,
    };
    try {
      await signUp(payload);
      reset();
      toast.success("Account created. Please sign in.");
      navigate(paths.signIn, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't create your account. Please try again."));
    }
  };
  return (
    <section className="rounded-2xl bg-white p-6 sm:p-[30px]">
      <div className="mb-6">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[1px] text-violet">
          Start learning
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h2>
      </div>
      <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-4">
        <label className="grid gap-2 text-xs font-bold text-[#485752]">
          Display name
          <div className={field}>
            <UserRound size={17} />
            <input
              className="min-w-0 flex-1 outline-none"
              autoComplete="name"
              {...register("displayName")}
            />
          </div>
          {errors.displayName && (
            <p className="text-[#b64034]">{errors.displayName.message}</p>
          )}
        </label>
        <label className="grid gap-2 text-xs font-bold text-[#485752]">
          Email address
          <div className={field}>
            <Mail size={17} />
            <input
              className="min-w-0 flex-1 outline-none"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-[#b64034]">{errors.email.message}</p>
          )}
        </label>
        <label className="grid gap-2 text-xs font-bold text-[#485752]">
          Password
          <div className={field}>
            <LockKeyhole size={17} />
            <input
              className="min-w-0 flex-1 outline-none"
              type={visible ? "text" : "password"}
              autoComplete="new-password"
              {...register("password")}
            />
            <button
              type="button"
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((value) => !value)}
            >
              {visible ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[#b64034]">{errors.password.message}</p>
          )}
        </label>
        <label className="grid gap-2 text-xs font-bold text-[#485752]">
          Confirm password
          <div className={field}>
            <LockKeyhole size={17} />
            <input
              className="min-w-0 flex-1 outline-none"
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
          {errors.confirmPassword && (
            <p className="text-[#b64034]">{errors.confirmPassword.message}</p>
          )}
        </label>
        <button
          className="mt-2 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-violet px-5 text-sm font-bold text-white hover:bg-violet-deep disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait…" : "Create account"}
          <ArrowRight size={17} />
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-muted">
        Already have an account?{" "}
        <Link className="font-bold text-violet" to={paths.signIn}>
          Sign in
        </Link>
      </p>
    </section>
  );
}
