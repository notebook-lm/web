import { Sparkles } from "lucide-react";

export function RouteLoading() {
  return (
    <main className="grid min-h-svh place-items-center bg-canvas p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#e8f4f0] text-violet motion-safe:animate-pulse">
          <Sparkles size={21} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">Preparing your workspace</p>
          <p className="mt-1 text-xs text-muted">Just a moment…</p>
        </div>
        <span className="flex gap-1.5" aria-label="Loading">
          <i className="size-1.5 animate-bounce rounded-full bg-violet [animation-delay:-.2s]" />
          <i className="size-1.5 animate-bounce rounded-full bg-violet [animation-delay:-.1s]" />
          <i className="size-1.5 animate-bounce rounded-full bg-violet" />
        </span>
      </div>
    </main>
  );
}
