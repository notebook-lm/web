import { BookOpen, MessageCircleQuestion, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Project } from "../model";
import { ProjectSourcesPanel } from "./ProjectSourcesPanel";
import { ProjectStudioPanel } from "./ProjectStudioPanel";
import { ProjectWorkspaceHeader } from "./ProjectWorkspaceHeader";

interface Props {
  project: Project;
  onOpenDetails: () => void;
}
export function ProjectWorkspace({ project, onOpenDetails }: Props) {
  const [prompt, setPrompt] = useState("");
  return (
    <section className="flex min-h-svh flex-col bg-[var(--color-bg-canvas)]">
      <ProjectWorkspaceHeader project={project} onOpenDetails={onOpenDetails} />
      <div className="grid min-h-0 flex-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <ProjectSourcesPanel project={project} />
        <main className="flex min-w-0 flex-col px-5 py-10 sm:px-10">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center text-center">
            <div className="flex w-full items-center justify-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--color-bg-selected)] text-[var(--color-text-action)]">
                <BookOpen size={22} />
              </span>
              <h1 className="line-clamp-2 min-w-0 max-w-xl break-words font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Start exploring <em>{project.title}.</em>
              </h1>
            </div>
            <p className="mt-4 line-clamp-3 max-w-xl break-words text-sm leading-6 text-muted">
              {project.description ||
                "Your project is ready. Add sources when they are available, then use this canvas to guide your research."}
            </p>
          </div>
          <form
            className="mx-auto mt-8 flex w-full max-w-2xl gap-2 rounded-[var(--radius-xs)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="project-prompt">
              Ask about this project
            </label>
            <MessageCircleQuestion
              className="m-2 shrink-0 text-muted"
              size={18}
            />
            <input
              id="project-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask about this project"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <button
              disabled={!prompt.trim()}
              className="grid size-10 place-items-center rounded-full bg-[var(--color-bg-selected)] text-[var(--color-text-action)] disabled:opacity-50"
              aria-label="Send project question"
            >
              <Sparkles size={17} />
            </button>
          </form>
        </main>
        <ProjectStudioPanel />
      </div>
    </section>
  );
}
