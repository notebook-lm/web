import { ArrowLeft, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../model";

interface ProjectWorkspaceHeaderProps {
  project: Project;
  onOpenDetails: () => void;
}

export function ProjectWorkspaceHeader({
  project,
  onOpenDetails,
}: ProjectWorkspaceHeaderProps) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          id="project-back"
          aria-label="Back to projects"
          className="grid size-11 shrink-0 place-items-center rounded-full text-muted hover:bg-[var(--color-bg-surface-subtle)]"
          to="/app"
        >
          <ArrowLeft size={19} />
        </Link>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{project.title}</p>
          <p className="text-xs text-muted">Project workspace</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          id="project-details"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold hover:bg-[var(--color-bg-surface-subtle)]"
          onClick={onOpenDetails}
        >
          <Settings2 size={17} />{" "}
          <span className="hidden sm:inline">Project details</span>
        </button>
      </div>
    </header>
  );
}
