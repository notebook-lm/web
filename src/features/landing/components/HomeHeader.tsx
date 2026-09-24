import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/routes/config/paths";
import { cn } from "@/shared/utils/cn";
import { homeNavigation } from "./home-content";

export function HomeHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-transparent bg-canvas/90 px-5 backdrop-blur sm:px-8">
      <button
        onClick={() => goTo("top")}
        className="inline-flex items-center gap-2 text-lg font-bold tracking-tight"
      >
        <span className="grid size-7 place-content-center gap-[3px] rounded-lg bg-ink p-[5px]">
          <i className="h-0.5 w-4 rounded bg-white" />
          <i className="h-0.5 w-3 rounded bg-white" />
          <i className="h-0.5 w-3.5 rounded bg-white" />
        </span>
        NotebookLM
      </button>
      <button
        className="md:hidden"
        aria-label="Toggle navigation"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      <nav
        className={cn(
          "absolute left-4 right-4 top-[68px] hidden rounded-xl bg-white p-4 md:static md:flex md:items-center md:gap-7 md:bg-transparent md:p-0 md:shadow-none",
          isOpen && "grid",
        )}
      >
        {homeNavigation.map(({ label, target }) => (
          <button
            className="p-2 text-left text-sm font-medium text-muted hover:text-violet"
            onClick={() => goTo(target)}
            key={target}
          >
            {label}
          </button>
        ))}
        <Link className="p-2 text-sm font-bold" to={paths.signIn}>
          Sign in
        </Link>
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-violet px-4 text-sm font-bold text-white hover:bg-violet-deep"
          to={paths.signUp}
        >
          Try NotebookLM <ArrowRight size={16} />
        </Link>
      </nav>
    </header>
  );
}
