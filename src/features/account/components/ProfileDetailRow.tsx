import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface ProfileDetailRowProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  mono?: boolean;
}

export function ProfileDetailRow({
  icon,
  label,
  children,
  mono = false,
}: ProfileDetailRowProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-4 py-3.5 sm:px-5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eaf5f1] text-violet">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#74827c]">
          {label}
        </dt>
        <dd
          className={cn(
            "mt-0.5 truncate text-sm font-semibold text-ink",
            mono && "font-mono text-xs font-medium text-muted",
          )}
        >
          {children}
        </dd>
      </div>
    </div>
  );
}
