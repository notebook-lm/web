import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { howItWorksSteps, productFeatures } from "./home-content";

export function HowItWorksSection() {
  return (
    <section id="how" className="bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-[1120px]">
        <p className="font-mono text-[11px] uppercase tracking-widest text-violet">
          A better way to work with knowledge
        </p>
        <h2 className="mt-4 max-w-xl text-[clamp(35px,4vw,50px)] font-semibold tracking-[-.055em]">
          Your sources become a thinking space.
        </h2>
        <ol className="mt-16 grid gap-10 md:grid-cols-3">
          {howItWorksSteps.map(([number, title, copy]) => (
            <li className="border-t border-[#d9dfda] pt-5" key={number}>
              <span className="font-mono text-xs text-violet">{number}</span>
              <h3 className="mt-8 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FeatureHighlights() {
  return (
    <section id="features" className="bg-[#f1f0eb] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-[1120px] text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-violet">
          The clarity to go further
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(35px,4vw,50px)] font-semibold tracking-[-.055em]">
          A research partner that stays with the work.
        </h2>
        <div className="mt-14 grid gap-4 text-left md:grid-cols-3">
          {productFeatures.map(({ icon: Icon, title, copy }) => (
            <article className="rounded-xl bg-white/75 p-7" key={title}>
              <span className="grid size-11 place-items-center rounded-xl bg-[#efedff] text-violet">
                <Icon size={22} />
              </span>
              <h3 className="mt-6 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCallToAction() {
  return (
    <section id="about" className="bg-violet px-5 py-24 text-center text-white">
      <Sparkles className="mx-auto" />
      <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-[#c7eee4]">
        Ready when you are
      </p>
      <h2 className="mt-4 text-[clamp(42px,5vw,62px)] font-semibold tracking-[-.06em]">
        Make room for your
        <br />
        <em className="font-serif font-medium text-[#c7eee4]">
          best thinking.
        </em>
      </h2>
      <p className="mt-5 text-[#d4eee8]">
        Start a notebook and see what your sources can become.
      </p>
      <Link
        className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-[10px] bg-white px-5 text-sm font-bold text-violet"
        to={paths.signUp}
      >
        Start a notebook <ArrowRight size={18} />
      </Link>
    </section>
  );
}
