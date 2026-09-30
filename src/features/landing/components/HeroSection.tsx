import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/routes/config/paths";
import { ProductPreview } from "./ProductPreview";

export function HeroSection() {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-20 sm:px-8 md:min-h-[650px] md:grid-cols-[.85fr_1.15fr]"
    >
      <div>
        <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-violet">
          <Sparkles size={15} />
          Research, reimagined
        </p>
        <h1 className="text-[clamp(48px,5.5vw,72px)] font-semibold leading-[1.1] tracking-[-.045em]">
          Think with your sources,
          <br />
          <em className="font-serif font-medium text-violet">
            not around them.
          </em>
        </h1>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-muted">
          NotebookLM is your personalized research partner. Bring sources
          together, ask better questions, and turn complexity into
          understanding.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <Link
            className="inline-flex min-h-12 items-center gap-2 rounded-[10px] bg-violet px-5 text-sm font-bold text-white hover:bg-violet-deep"
            to={paths.signUp}
          >
            Start a notebook <ArrowRight size={18} />
          </Link>
          <a href="#how" className="text-sm font-bold hover:text-violet">
            See how it works →
          </a>
        </div>
        <p className="mt-6 flex items-center gap-2 text-xs text-muted">
          <Check size={15} className="text-violet" />
          Built for your ideas. Grounded in your work.
        </p>
      </div>
      <ProductPreview />
    </section>
  );
}
