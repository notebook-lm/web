import { ArrowLeft, Files, MessageSquareText, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../model";

interface ProjectWorkspaceHeaderProps {
  project: Project;
  onOpenDetails: () => void;
  onOpenChats: () => void;
  onOpenSources: () => void;
}

export function ProjectWorkspaceHeader({
  project,
  onOpenDetails,
  onOpenChats,
  onOpenSources,
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
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <button
          aria-label="Open chat sessions"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:bg-[var(--color-bg-surface-subtle)] xl:hidden"
          id="project-open-chats"
          onClick={onOpenChats}
          type="button"
        >
          <MessageSquareText size={17} />
          <span className="hidden sm:inline">Chats</span>
        </button>
        <button
          aria-label="Open project sources"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:bg-[var(--color-bg-surface-subtle)] xl:hidden"
          id="project-open-sources"
          onClick={onOpenSources}
          type="button"
        >
          <Files size={17} />
          <span className="hidden sm:inline">Sources</span>
        </button>
        <button
          id="project-details"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 sm:px-4 text-sm font-semibold hover:bg-[var(--color-bg-surface-subtle)]"
          onClick={onOpenDetails}
          type="button"
        >
          <Settings2 size={17} />
          <span className="hidden md:inline">Project details</span>
        </button>
      </div>
    </header>
  );
}
