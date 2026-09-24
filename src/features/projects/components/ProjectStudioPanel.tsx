import { Sparkles } from "lucide-react";
export function ProjectStudioPanel() {
  return (
    <aside
      aria-label="Studio"
      className="border-t border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4 xl:border-l xl:border-t-0"
    >
      <h2 className="text-sm font-semibold">Studio</h2>
      <div className="mt-4 rounded-[var(--radius-xs)] bg-[var(--color-bg-surface-subtle)] p-4">
        <div className="flex items-center gap-2 text-[var(--color-text-action)]">
          <Sparkles size={17} />
          <p className="text-sm font-semibold">Your outputs, in one place</p>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">
          Briefs, study guides, and other project artifacts will live here once
          Studio is available.
        </p>
      </div>
    </aside>
  );
}
