import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Brand from "../components/Brand";
import "../App.css";

function AuthPage() {
  return (
    <main className="auth-page">
      <header className="auth-header">
        <Brand />
        <Link className="back-home" to="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>
      </header>

      <section className="auth-layout" aria-labelledby="auth-title">
        <aside className="auth-aside">
          <p className="eyebrow">
            <Sparkles size={15} aria-hidden="true" />
            Your research, in focus
          </p>
          <h1>
            Make room for your <em>best thinking.</em>
          </h1>
          <p>Bring the sources that matter into one calm, capable space.</p>
          <ul>
            <li>
              <Check size={17} aria-hidden="true" />
              Ask questions grounded in your material
            </li>
            <li>
              <Check size={17} aria-hidden="true" />
              Find the thread across every source
            </li>
            <li>
              <Check size={17} aria-hidden="true" />
              Create useful work from real insight
            </li>
          </ul>
        </aside>

        <AuthForm />
      </section>
    </main>
  );
}

export default AuthPage;
