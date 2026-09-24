import { Link } from "react-router-dom";

export interface BrandProps {
  to?: string;
}

export function Brand({ to = "/" }: BrandProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-lg font-bold tracking-[-.7px] text-ink no-underline"
    >
      <span className="grid size-7 place-content-center gap-[3px] rounded-lg bg-ink p-[5px] -rotate-3">
        <i className="block h-0.5 w-[17px] rounded bg-white" />
        <i className="block h-0.5 w-3 rounded bg-white" />
        <i className="block h-0.5 w-3.5 rounded bg-white" />
      </span>
      NotebookLM
    </Link>
  );
}
