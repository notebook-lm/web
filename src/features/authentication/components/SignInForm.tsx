import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { paths } from "@/routes/config/paths";
import { signInSchema, type SignInValues } from "@/shared/utils/validators";
import { useSignIn } from "@/features/authentication";

const field =
  "flex min-h-[46px] items-center gap-2 rounded-lg border-0 bg-[#f4f7f4] px-3 text-[#7b8985]";

export function SignInForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const { mutateAsync: signIn } = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const submit = async (values: SignInValues) => {
    try {
      await signIn(values);
      toast.success("Signed in successfully.");
      navigate(
        (location.state as { from?: { pathname?: string } })?.from?.pathname ||
          paths.workspace,
        { replace: true },
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <section className="rounded-2xl bg-white p-6 sm:p-[30px]">
      <div className="mb-6">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[1px] text-violet">
          Welcome back
        </p>
        <h2 id="auth-title" className="text-2xl font-semibold tracking-tight">
          Sign in to NotebookLM
        </h2>
        <p className="mt-2 text-[13px] text-muted">
          Continue where your thinking left off.
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-4">
        <label className="grid gap-2 text-xs font-bold text-[#485752]">
          Email address
          <div className={field}>
            <Mail size={17} />
            <input
              className="min-w-0 flex-1 outline-none"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
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
              autoComplete="current-password"
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
        <button
          className="mt-2 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-violet px-5 text-sm font-bold text-white hover:bg-violet-deep disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait…" : "Sign in"}
          <ArrowRight size={17} />
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-muted">
        New to NotebookLM?{" "}
        <Link className="font-bold text-violet" to={paths.signUp}>
          Create account
        </Link>
      </p>
    </section>
  );
}
