import { ArrowRight, Eye, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

type AuthMode = "signin" | "signup";

function AuthForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const mode: AuthMode =
    searchParams.get("mode") === "signin" ? "signin" : "signup";
  const isSignIn = mode === "signin";

  const setMode = (nextMode: AuthMode) => {
    setSubmitted(false);
    setSearchParams({ mode: nextMode });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <div
        className="auth-tabs"
        role="tablist"
        aria-label="Authentication type"
      >
        <button
          type="button"
          role="tab"
          aria-selected={isSignIn}
          className={isSignIn ? "is-active" : ""}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isSignIn}
          className={!isSignIn ? "is-active" : ""}
          onClick={() => setMode("signup")}
        >
          Create account
        </button>
      </div>

      <div className="auth-card-copy">
        <h2 id="auth-title">
          {isSignIn ? "Welcome back" : "Start your first notebook"}
        </h2>
        <p>
          {isSignIn
            ? "Sign in to continue your work."
            : "Create an account to begin exploring your sources."}
        </p>
      </div>

      <form onSubmit={submit}>
        <label htmlFor="email">Email address</label>
        <div className="auth-input">
          <Mail size={17} aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <label htmlFor="password">Password</label>
        <div className="auth-input">
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignIn ? "current-password" : "new-password"}
            placeholder="At least 8 characters"
            required
          />
          <Eye size={17} aria-hidden="true" />
        </div>

        {isSignIn && (
          <a className="forgot-link" href="#forgot-password">
            Forgot password?
          </a>
        )}

        <button className="button button-primary auth-submit" type="submit">
          {isSignIn ? "Sign in" : "Create account"}
          <ArrowRight size={17} aria-hidden="true" />
        </button>

        {submitted && (
          <p className="form-status" role="status">
            Thanks — authentication will be connected to the API next.
          </p>
        )}
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <button className="oauth-button" type="button">
        <span className="google-g">G</span>
        Google
      </button>

      <p className="auth-switch">
        {isSignIn ? "New to NotebookLM?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setMode(isSignIn ? "signup" : "signin")}
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </button>
      </p>
    </section>
  );
}

export default AuthForm;
