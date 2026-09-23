import type { ReactNode } from "react";

export interface PageHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header>
      <p className="mb-4 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[1.2px] text-violet">
        {eyebrow}
      </p>
      <h1 className="text-[clamp(38px,4.5vw,56px)] font-semibold leading-[1.05] tracking-[-2.3px] [&_em]:font-serif [&_em]:font-medium [&_em]:text-violet">
        {title}
      </h1>
      <p className="mt-4 text-[15px] text-muted">{description}</p>
    </header>
  );
}
