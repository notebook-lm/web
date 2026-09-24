import { FileText, Plus } from "lucide-react";
import type { Project } from "../model";
export function ProjectSourcesPanel({ project }: { project: Project }) {
  return (
    <aside
      aria-label="Sources"
      className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4 lg:border-r lg:border-b-0"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Sources</h2>
        <span className="text-xs text-muted">0 sources</span>
      </div>
      <button
        disabled
        title="Source management is not available yet"
        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-bg-surface-subtle)] px-4 text-sm font-semibold text-muted"
      >
        <Plus size={17} /> Add source
      </button>
      <div className="grid min-h-48 place-items-center py-8 text-center">
        <div>
          <FileText className="mx-auto text-muted" size={24} />
          <p className="mt-3 text-sm font-semibold">No sources yet</p>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-muted">
            Source management will appear here when it becomes available for{" "}
            {project.title}.
          </p>
        </div>
      </div>
    </aside>
  );
}
