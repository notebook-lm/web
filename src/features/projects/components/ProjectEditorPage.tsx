import { FolderKanban, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader, RouteLoading } from "@/shared/components";
import type { ProjectValues } from "@/shared/utils/validators";
import {
  useCreateProject,
  useDeleteProject,
  useProject,
  useUpdateProject,
} from "../hooks";
import { ProjectForm } from "./ProjectForm";
import { ProjectWorkspace } from "./ProjectWorkspace";

export function ProjectEditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const isNew = !projectId;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const projectQuery = useProject(projectId);
  const { mutateAsync: create, isPending: creating } = useCreateProject();
  const { mutateAsync: update, isPending: updating } = useUpdateProject();
  const { mutateAsync: remove, isPending: deleting } = useDeleteProject();

  if (!isNew && projectQuery.isLoading) return <RouteLoading />;
  if (!isNew && projectQuery.isError)
    return (
      <p className="rounded-[var(--radius-xs)] bg-[var(--color-bg-surface)] p-6 text-sm text-muted">
        We couldn’t load this project. Return to your projects and try again.
      </p>
    );
  const project = projectQuery.data;

  const submit = async (values: ProjectValues) => {
    try {
      if (project) {
        await update({ projectId: project.id, payload: values });
        toast.success("Project details saved.");
        setDetailsOpen(false);
      } else {
        const created = await create(values);
        toast.success("Project created.");
        navigate(`/app/projects/${created.id}`, { replace: true });
      }
    } catch {
      toast.error("We couldn’t save this project. Please try again.");
    }
  };
  const deleteProject = async () => {
    if (
      !project ||
      !window.confirm(`Delete “${project.title}”? This cannot be undone.`)
    )
      return;
    try {
      await remove(project.id);
      toast.success("Project deleted.");
      navigate("/app");
    } catch {
      toast.error("We couldn’t delete this project. Please try again.");
    }
  };

  if (!isNew && project)
    return (
      <>
        <ProjectWorkspace
          project={project}
          onOpenDetails={() => setDetailsOpen(true)}
        />
        {detailsOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-details-title"
            className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4"
          >
            <section className="max-h-[90svh] w-full max-w-xl overflow-auto rounded-[var(--radius-xs)] bg-[var(--color-bg-surface)] p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-action)]">
                    Project settings
                  </p>
                  <h2
                    id="project-details-title"
                    className="mt-1 font-serif text-2xl font-semibold"
                  >
                    Project details
                  </h2>
                </div>
                <button
                  aria-label="Close project details"
                  className="grid size-11 place-items-center rounded-full hover:bg-[var(--color-bg-surface-subtle)]"
                  onClick={() => setDetailsOpen(false)}
                >
                  <X size={19} />
                </button>
              </div>
              <ProjectForm
                key={project.id}
                project={project}
                onSubmit={submit}
                isSubmitting={updating}
              />
              <div className="mt-8 border-t border-[var(--color-border-default)] pt-5">
                <button
                  id="project-delete"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[var(--color-state-error)] hover:bg-[#fff0ee] disabled:opacity-60"
                  disabled={deleting}
                  onClick={() => void deleteProject()}
                >
                  <Trash2 size={16} />
                  {deleting ? "Deleting project…" : "Delete project"}
                </button>
              </div>
            </section>
          </div>
        )}
      </>
    );
  return (
    <section className="mx-auto max-w-[760px]">
      <PageHeader
        eyebrow={
          <>
            <FolderKanban size={15} /> Projects
          </>
        }
        title={
          <>
            <em>Start</em> a new project
          </>
        }
        description="Give your research space a focused name and a clear starting point."
      />
      <div className="mt-8 rounded-[var(--radius-xs)] bg-[var(--color-bg-surface)] p-5 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-[var(--color-bg-selected)] text-[var(--color-text-action)]">
            <Plus size={21} />
          </span>
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Project details
            </h2>
            <p className="mt-1 text-sm text-muted">
              You can refine these details whenever you need.
            </p>
          </div>
        </div>
        <ProjectForm onSubmit={submit} isSubmitting={creating} />
      </div>
    </section>
  );
}
