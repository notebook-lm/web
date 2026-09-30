import { LoaderCircle, Save } from "lucide-react";
import { useState } from "react";
import type { ProjectValues } from "@/shared/utils/validators";
import type { Project } from "../model";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (values: ProjectValues) => Promise<Record<string, string> | undefined>;
  isSubmitting: boolean;
}

export function ProjectForm({
  project,
  onSubmit,
  isSubmitting,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectValues>(() => ({
    title: project?.title ?? "",
    description: project?.description ?? "",
  }));
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProjectValues, string>>
  >({});

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = values.title.trim();
    const description = values.description.trim();
    const nextErrors: Partial<Record<keyof ProjectValues, string>> = {};

    if (!title) nextErrors.title = "Project title is required.";
    else if (title.length > 150)
      nextErrors.title = "Project title must contain at most 150 characters.";
    if (description.length > 2000)
      nextErrors.description =
        "Description must contain at most 2,000 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const serverErrors = await onSubmit({ title, description });
    if (!serverErrors) return;

    setErrors((current) => ({
      ...current,
      ...(serverErrors.title ? { title: serverErrors.title } : {}),
      ...(serverErrors.description ? { description: serverErrors.description } : {}),
    }));
  };

  return (
    <form className="mt-8 grid gap-6" onSubmit={submit}>
      <div>
        <label className="text-sm font-bold" htmlFor="project-title">
          Project title
        </label>
        <input
          className={`mt-2 min-h-12 w-full rounded-xl border bg-[#f1f5f2] px-4 text-sm outline-none transition focus:bg-[#f1f5f2] focus:shadow-none ${errors.title ? "border-[#b64034]" : "border-transparent"}`}
          id="project-title"
          autoFocus
          placeholder="e.g. Climate policy research"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "project-title-error" : undefined}
          value={values.title}
          onChange={(event) => {
            setValues((current) => ({ ...current, title: event.target.value }));
            setErrors((current) => ({ ...current, title: undefined }));
          }}
        />
        {errors.title && (
          <p
            id="project-title-error"
            className="mt-2 text-xs text-[var(--color-state-error)]"
          >
            {errors.title}
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-bold" htmlFor="project-description">
          Description <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          className={`mt-2 min-h-36 w-full resize-y rounded-xl border bg-[#f1f5f2] px-4 py-3 text-sm outline-none transition focus:bg-[#f1f5f2] focus:shadow-none ${errors.description ? "border-[#b64034]" : "border-transparent"}`}
          id="project-description"
          placeholder="Capture the purpose, questions, or sources for this project."
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "project-description-error" : undefined
          }
          value={values.description}
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }));
            setErrors((current) => ({ ...current, description: undefined }));
          }}
        />
        {errors.description && (
          <p
            id="project-description-error"
            className="mt-2 text-xs text-[var(--color-state-error)]"
          >
            {errors.description}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          id="project-save"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-violet px-5 text-sm font-bold text-white transition hover:bg-violet-deep disabled:cursor-wait disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" size={17} />
          ) : (
            <Save size={17} />
          )}
          {isSubmitting
            ? "Saving…"
            : project
              ? "Save changes"
              : "Create project"}
        </button>
      </div>
    </form>
  );
}
