import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/routes/config/paths";

export function AccessDenied() {
  return (
    <main className="grid min-h-svh place-items-center p-5 text-center">
      <div>
        <ShieldAlert className="mx-auto text-violet" size={32} />
        <p className="mt-5 text-xs font-bold uppercase tracking-widest text-violet">
          Access restricted
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          You don’t have permission to view this page.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Your account is signed in, but the required access is not available.
        </p>
        <Link
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-violet px-4 text-sm font-bold text-white"
          to={paths.workspace}
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>
      </div>
    </main>
  );
}
