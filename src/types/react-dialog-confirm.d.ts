declare module "react-dialog-confirm" {
  import type { ReactNode } from "react";

  export function DialogProvider({ children }: { children: ReactNode }): ReactNode;

  export function useModal(): {
    openModal(content: ReactNode): void;
    closeModal(): void;
  };

  export function DialogModal(props: {
    icon?: "success" | "warning" | "error" | "info";
    title?: string;
    description?: string;
    confirm?: string;
    cancel?: string;
    hasCancel?: boolean;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    customFooter?: ReactNode;
  }): ReactNode;
}
