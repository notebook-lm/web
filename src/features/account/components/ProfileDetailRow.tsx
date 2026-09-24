import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface ProfileDetailRowProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  highlighted?: boolean;
}

export function ProfileDetailRow({
  icon,
  label,
  children,
  highlighted = false,
}: ProfileDetailRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[9px] px-[13px] py-3.5",
        highlighted && "bg-white py-4",
      )}
    >
      <span
        className={cn(
          "grid shrink-0 place-items-center",
          highlighted
            ? "size-[42px] rounded-xl bg-[linear-gradient(145deg,#e98766,#c75f55)] text-base font-extrabold text-white"
            : "size-[34px] rounded-[9px] bg-[#e8f4f0] text-violet",
        )}
      >
        {icon}
      </span>
      <span className="grid min-w-0 gap-1">
        <small className="text-[10px] font-extrabold uppercase tracking-[.06em] text-[#81908a]">
          {label}
        </small>
        {children}
      </span>
    </div>
  );
}
