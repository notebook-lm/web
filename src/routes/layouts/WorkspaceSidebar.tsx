import { FolderKanban, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { paths } from "@/routes/paths";
import { cn } from "@/shared/utils/cn";
import { Brand } from "@/ui/Brand";

interface WorkspaceSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function WorkspaceSidebar({ open, onClose }: WorkspaceSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-[248px] -translate-x-full flex-col bg-white p-4 pt-6 transition-transform md:sticky md:translate-x-0",
        open && "translate-x-0",
      )}
    >
      <div className="flex items-center justify-between px-2">
        <Brand to={paths.workspace} />
        <button className="md:hidden" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <nav className="mt-10 grid gap-1">
        <NavLink
          end
          to={paths.workspace}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold",
              isActive
                ? "bg-[#e8f4f0] text-violet"
                : "text-[#66706c] hover:bg-[#f2f8f6] hover:text-violet",
            )
          }
        >
          <FolderKanban size={18} />
          Projects
        </NavLink>
      </nav>
    </aside>
  );
}
