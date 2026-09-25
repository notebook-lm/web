import {
  ArrowDownAZ,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthSession } from "@/features/authentication";
import { useProjects } from "@/features/projects";
import type { ListProjectsParams } from "@/features/projects/api";
import { PageHeader } from "@/shared/components";
import { getErrorMessage } from "@/shared/errors/error-message";

const PAGE_SIZE = 12;

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

const sortOptions: Record<
  SortOption,
  { label: string; sortBy: string; direction: "asc" | "desc" }
> = {
  newest: { label: "Recently updated", sortBy: "updatedAt", direction: "desc" },
  oldest: { label: "Oldest first", sortBy: "createdAt", direction: "asc" },
  "title-asc": { label: "Name: A to Z", sortBy: "title", direction: "asc" },
  "title-desc": { label: "Name: Z to A", sortBy: "title", direction: "desc" },
};

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

function toStartOfDay(value: string) {
  return value ? new Date(`${value}T00:00:00`).toISOString() : undefined;
}

function toEndOfDay(value: string) {
  return value ? new Date(`${value}T23:59:59.999`).toISOString() : undefined;
}

export function WorkspacePage() {
  const { user } = useAuthSession();
  const [search, setSearch] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(0);
  const deferredSearch = useDeferredValue(search.trim());
  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  const params = useMemo<ListProjectsParams>(() => {
    const selectedSort = sortOptions[sort];
    return {
      ...(deferredSearch ? { q: deferredSearch } : {}),
      ...(createdFrom ? { createdFrom: toStartOfDay(createdFrom) } : {}),
      ...(createdTo ? { createdTo: toEndOfDay(createdTo) } : {}),
      sortBy: selectedSort.sortBy,
      direction: selectedSort.direction,
      page,
      size: PAGE_SIZE,
    };
  }, [createdFrom, createdTo, deferredSearch, page, sort]);

  const { data, error, isLoading, isError, isFetching } = useProjects(params);
  const projects = data?.items ?? [];
  const hasFilters = Boolean(search || createdFrom || createdTo || sort !== "newest");

  const resetFilters = () => {
    setSearch("");
    setCreatedFrom("");
    setCreatedTo("");
    setSort("newest");
    setPage(0);
  };

  return (
    <section>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow={<><Sparkles size={15} /> Your research space</>}
          title={<>Good evening, <em>{firstName}.</em></>}
          description={
            isLoading
              ? "Gathering your research spaces…"
              : `You have ${data?.totalItems ?? 0} project${data?.totalItems === 1 ? "" : "s"} in your research space.`
          }
        />
        <Link id="create-project" to="/app/projects/new" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-violet-deep">
          <Plus size={18} /> New project
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <label className="relative block" htmlFor="project-search">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={17} />
            <input id="project-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Search projects by name or description" className="min-h-11 w-full rounded-xl bg-[#f1f5f2] py-2 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-violet/25" />
          </label>
          <label className="relative" htmlFor="project-sort">
            <ArrowDownAZ className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <select id="project-sort" value={sort} onChange={(event) => { setSort(event.target.value as SortOption); setPage(0); }} className="min-h-11 w-full appearance-none rounded-xl bg-[#f1f5f2] py-2 pl-9 pr-8 text-sm font-medium outline-none transition focus:ring-2 focus:ring-violet/25 lg:w-48">
              {Object.entries(sortOptions).map(([value, option]) => <option key={value} value={value}>{option.label}</option>)}
            </select>
          </label>
          {hasFilters && <button id="projects-clear-filters" type="button" onClick={resetFilters} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-bold text-violet transition hover:bg-[#f4efff]"><X size={16} /> Clear filters</button>}
        </div>

        <div className="flex flex-col gap-3 border-t border-black/5 pt-4 sm:flex-row sm:items-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-muted"><CalendarDays size={15} /> Date</span>
          <label className="text-xs text-muted" htmlFor="projects-created-from">From
            <input id="projects-created-from" type="date" max={createdTo || undefined} value={createdFrom} onChange={(event) => { setCreatedFrom(event.target.value); setPage(0); }} className="ml-2 min-h-9 rounded-lg border border-black/8 bg-white px-2 text-sm text-ink outline-none focus:ring-2 focus:ring-violet/25" />
          </label>
          <label className="text-xs text-muted" htmlFor="projects-created-to">To
            <input id="projects-created-to" type="date" min={createdFrom || undefined} value={createdTo} onChange={(event) => { setCreatedTo(event.target.value); setPage(0); }} className="ml-2 min-h-9 rounded-lg border border-black/8 bg-white px-2 text-sm text-ink outline-none focus:ring-2 focus:ring-violet/25" />
          </label>
        </div>
      </div>

      {isLoading && <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-white" />)}</div>}
      {isError && <div className="mt-5 rounded-2xl border border-black/5 bg-white p-8 text-sm text-muted">{getErrorMessage(error, "We couldn’t load your projects right now. Refresh the page to try again.")}</div>}
      {!isLoading && !isError && !projects.length && <div className="mt-5 grid min-h-75 place-items-center rounded-2xl border border-dashed border-[#c8dad3] bg-[#f2f8f5] p-8 text-center"><div><span className="mx-auto grid size-13 place-items-center rounded-2xl border border-black/5 bg-white text-violet"><FolderKanban size={25} /></span><h2 className="mt-5 font-serif text-2xl font-semibold">{hasFilters ? "No matching projects." : "A blank page, full of possibility."}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{hasFilters ? "Try widening your search or clearing the active filters." : "Create a project to collect your questions, sources, and ideas in one calm place."}</p>{hasFilters ? <button type="button" onClick={resetFilters} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet/15 bg-white px-4 text-sm font-bold text-violet transition hover:bg-[#f4efff]"><X size={17} /> Clear filters</button> : <Link to="/app/projects/new" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet px-4 text-sm font-bold text-white transition hover:bg-violet-deep"><Plus size={17} /> Create your first project</Link>}</div></div>}
      {!isLoading && !isError && Boolean(projects.length) && <><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <Link key={project.id} to={`/app/projects/${project.id}`} className="group relative min-h-48 rounded-2xl border border-black/5 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[var(--color-border-default)]"><span className="grid size-10 place-items-center rounded-xl bg-[#e7f2ee] text-violet"><FolderKanban size={19} /></span><ArrowUpRight className="absolute right-5 top-5 text-muted transition group-hover:text-violet" size={18} /><h3 className="mt-6 line-clamp-1 font-serif text-xl font-semibold">{project.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-5 text-muted">{project.description || "No description yet — add some context to guide your work."}</p><p className="mt-5 text-xs font-bold text-[#89948f]">{relativeDate(project.updatedAt)}</p></Link>)}</div>
        <nav aria-label="Project list pagination" className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-black/5 pt-5 sm:flex-row"><p className="text-sm text-muted">Page <strong className="text-ink">{(data?.page ?? 0) + 1}</strong> of <strong className="text-ink">{Math.max(data?.totalPages ?? 0, 1)}</strong></p><div className="flex gap-2"><button id="projects-previous-page" type="button" disabled={!data?.hasPrevious || isFetching} onClick={() => setPage((current) => Math.max(0, current - 1))} className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-black/8 bg-white px-3 text-sm font-bold transition hover:bg-[#f5f7f5] disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={17} /> Previous</button><button id="projects-next-page" type="button" disabled={!data?.hasNext || isFetching} onClick={() => setPage((current) => current + 1)} className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-black/8 bg-white px-3 text-sm font-bold transition hover:bg-[#f5f7f5] disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={17} /></button></div></nav></>}
    </section>
  );
}
