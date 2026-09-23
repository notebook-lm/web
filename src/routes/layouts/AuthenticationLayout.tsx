import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { SignInForm } from "@/features/authentication";
import { SignUpForm } from "@/features/authentication";
import { Brand } from "@/ui/Brand";
import { authenticationCopy } from "./authentication-copy";
import { AuthenticationBenefits } from "./AuthenticationBenefits";

type AuthenticationMode = "login" | "register";

interface AuthenticationLayoutProps {
  mode: AuthenticationMode;
}

export function AuthenticationLayout({ mode }: AuthenticationLayoutProps) {
  const copy = authenticationCopy[mode];
  return (
    <main className="min-h-svh bg-canvas">
      <header className="mx-auto flex min-h-[84px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Brand />
        <Link
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted hover:text-violet"
          to={paths.home}
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </header>
      <section className="mx-auto grid min-h-[calc(100svh-84px)] max-w-[1050px] items-center gap-10 px-5 py-10 sm:px-8 md:grid-cols-[1fr_440px] md:gap-24">
        <aside className="text-center md:text-left">
          <p className="mb-4 flex items-center justify-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[1.2px] text-violet md:justify-start">
            <Sparkles size={15} />
            {copy.eyebrow}
          </p>
          <h1 className="text-[clamp(40px,5vw,65px)] font-semibold leading-[1.05] tracking-[-2.5px]">
            {copy.title}{" "}
            <em className="font-serif font-medium text-violet">
              {copy.emphasis}
            </em>
          </h1>
          <p className="mx-auto mt-5 max-w-[405px] text-[17px] leading-relaxed text-muted md:mx-0">
            {copy.description}
          </p>
          <AuthenticationBenefits />
        </aside>
        {mode === "login" ? <SignInForm /> : <SignUpForm />}
      </section>
    </main>
  );
}
