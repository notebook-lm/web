import { ArrowUpRight, FolderKanban, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthSession } from "@/features/authentication";
import { useProjects } from "@/features/projects";
import { PageHeader } from "@/shared/components";

function relativeDate(date: Date) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 86_400_000),
  );
  return days === 0
    ? "Updated today"
    : days === 1
      ? "Updated yesterday"
      : `Updated ${days} days ago`;
}

export function WorkspacePage() {
  const { user } = useAuthSession();
  const { data: projects, isLoading, isError } = useProjects();
  const firstName = user?.displayName?.split(" ")[0] ?? "there";
  return (
    <section>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow={
            <>
              <Sparkles size={15} /> Your research space
            </>
          }
          title={
            <>
              Good evening, <em>{firstName}.</em>
            </>
          }
          description="Organize each line of thinking into a space that is entirely yours."
        />
        <Link
          id="create-project"
          to="/app/projects/new"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet px-5 text-sm font-bold text-white shadow-[0_12px_24px_-16px_#176b62] transition hover:-translate-y-0.5 hover:bg-violet-deep"
        >
          <Plus size={18} /> New project
        </Link>
      </div>
      <div className="mt-10 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Your projects</h2>
          <p className="mt-1 text-sm text-muted">
            {isLoading
              ? "Gathering your spaces…"
              : `${projects?.length ?? 0} research space${projects?.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>
      {isLoading && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      )}
      {isError && (
        <div className="mt-5 rounded-2xl bg-white p-8 text-sm text-muted shadow-[0_18px_40px_-30px_rgba(27,44,40,.38)]">
          We couldn’t load your projects right now. Refresh the page to try
          again.
        </div>
      )}
      {!isLoading && !isError && !projects?.length && (
        <div className="mt-5 grid min-h-75 place-items-center rounded-2xl border border-dashed border-[#c8dad3] bg-[#f2f8f5] p-8 text-center">
          <div>
            <span className="mx-auto grid size-13 place-items-center rounded-2xl bg-white text-violet shadow-sm">
              <FolderKanban size={25} />
            </span>
            <h2 className="mt-5 font-serif text-2xl font-semibold">
              A blank page, full of possibility.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              Create a project to collect your questions, sources, and ideas in
              one calm place.
            </p>
            <Link
              to="/app/projects/new"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet px-4 text-sm font-bold text-white transition hover:bg-violet-deep"
            >
              <Plus size={17} /> Create your first project
            </Link>
          </div>
        </div>
      )}
      {!isLoading && !isError && Boolean(projects?.length) && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects?.map((project) => (
            <Link
              key={project.id}
              to={`/app/projects/${project.id}`}
              className="group relative min-h-48 rounded-2xl bg-white p-6 shadow-[0_18px_40px_-30px_rgba(27,44,40,.38)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_42px_-26px_rgba(23,107,98,.25)]"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-[#e7f2ee] text-violet">
                <FolderKanban size={19} />
              </span>
              <ArrowUpRight
                className="absolute right-5 top-5 text-muted transition group-hover:text-violet"
                size={18}
              />
              <h3 className="mt-6 line-clamp-1 font-serif text-xl font-semibold">
                {project.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted">
                {project.description ||
                  "No description yet — add some context to guide your work."}
              </p>
              <p className="mt-5 text-xs font-bold text-[#89948f]">
                {relativeDate(project.updatedAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
