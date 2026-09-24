import { BookOpen, Menu } from "lucide-react";
import { AccountMenu } from "@/features/authentication";

interface WorkspaceHeaderProps {
  onOpenMenu: () => void;
}

export function WorkspaceHeader({ onOpenMenu }: WorkspaceHeaderProps) {
  return (
    <header className="flex h-[70px] items-center justify-between bg-[#f7f8f5] px-5 sm:px-[42px]">
      <button
        id="workspace-menu-toggle"
        className="md:hidden"
        aria-label="Open menu"
        onClick={onOpenMenu}
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2 text-xs font-bold text-[#6e7773]">
        <BookOpen size={16} className="text-violet" />
        Your workspace
      </div>
      <AccountMenu />
    </header>
  );
}
