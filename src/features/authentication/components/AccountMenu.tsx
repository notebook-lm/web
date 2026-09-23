import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { paths } from "@/routes/paths";
import { useAuthSession, useSignOut } from "@/features/authentication";

export function AccountMenu() {
  const { user } = useAuthSession();
  const { mutateAsync: signOutRequest } = useSignOut();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);
  const signOut = async () => {
    await signOutRequest();
    toast.success("You have been signed out.");
    navigate(paths.signIn, { replace: true });
  };
  return (
    <div ref={menuRef} className="relative">
      <button
        id="account-menu-toggle"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((value) => !value)}
        className="flex items-center gap-2"
      >
        <span className="grid size-8 place-items-center rounded-full bg-[linear-gradient(145deg,#e98766,#c75f55)] text-xs font-extrabold text-white">
          {user?.displayName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-left sm:block">
          <strong className="block text-xs">{user?.displayName}</strong>
          <small className="block text-[10px] text-muted">{user?.email}</small>
        </span>
        <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-10 grid min-w-44 rounded-lg bg-white p-1"
        >
          <button
            role="menuitem"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-xs hover:bg-[#f1f8f5]"
            onClick={() => {
              setIsOpen(false);
              navigate(paths.profile);
            }}
          >
            <Settings size={16} />
            Account settings
          </button>
          <button
            role="menuitem"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[#b64034] hover:bg-[#fff1ef]"
            onClick={() => void signOut()}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
