import { Clapperboard } from "lucide-react";

interface ProjectStudioPanelProps {
  compact?: boolean;
}

export function ProjectStudioPanel({ compact = false }: ProjectStudioPanelProps) {
  return (
    <aside
      aria-label="Studio"
      className={
        compact
          ? "rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4 sm:p-5"
          : "flex h-full min-h-0 flex-col border-l border-[var(--color-border-default)] bg-[var(--color-bg-surface)]"
      }
    >
      <div className={compact ? "mb-3 flex items-center justify-between" : "px-6 pb-5 pt-6"}>
        <h2 className={compact ? "text-base font-bold" : "text-2xl font-semibold tracking-tight"}>
          Studio
        </h2>
        {compact && <span className="text-xs text-muted">Create from sources</span>}
      </div>

      <div className={compact ? "" : "app-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-5"}>
        <button
          aria-label="Create video overview, coming soon"
          className={`group flex w-full items-center gap-4 rounded-2xl border border-[#dfe7e4] bg-[#f4faf7] text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(21,36,30,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] ${compact ? "min-h-18 px-4 py-3" : "min-h-23 px-5"}`}
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
