import { useState } from "react";
import { Outlet } from "react-router-dom";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

export function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <main className="flex min-h-svh bg-[#f7f8f5] text-ink">
      <WorkspaceSidebar open={open} onClose={() => setOpen(false)} />
      {open && (
        <button
          className="fixed inset-0 z-20 bg-black/20 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
      <section className="min-w-0 flex-1">
        <WorkspaceHeader onOpenMenu={() => setOpen(true)} />
        <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-[54px] sm:py-[62px]">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
