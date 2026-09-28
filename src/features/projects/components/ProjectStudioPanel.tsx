import { Clapperboard } from "lucide-react";

export function ProjectStudioPanel() {
  return (
    <aside
      aria-label="Studio"
      className="flex min-h-0 flex-col border-t border-[var(--color-border-default)] bg-[var(--color-bg-surface)] xl:border-t-0 xl:border-l"
    >
      <div className="px-6 pb-5 pt-6">
        <h2 className="text-2xl font-semibold tracking-tight">Studio</h2>
      </div>

      <div className="app-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-5">
        <button
          aria-label="Create video overview, coming soon"
          className="group flex min-h-23 w-full items-center gap-4 rounded-2xl border border-[#dfe7e4] bg-[#f4faf7] px-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(21,36,30,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
          disabled
          id="create-video-overview"
          type="button"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#12a978] shadow-sm">
            <Clapperboard size={24} strokeWidth={2.3} />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-semibold">Create video</span>
            <span className="mt-1 block text-xs leading-5 text-muted">Create a video from your sources.</span>
          </span>
          <span className="ml-auto rounded-full bg-[var(--color-bg-selected)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-action)]">
            Soon
          </span>
        </button>
      </div>
    </aside>
  );
}
