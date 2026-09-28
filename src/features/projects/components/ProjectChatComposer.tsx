import { SendHorizontal, Square } from "lucide-react";
import { useState } from "react";

interface Props {
  disabled?: boolean;
  isStreaming: boolean;
  onCancel: () => void;
  onSend: (content: string) => Promise<void>;
}

export function ProjectChatComposer({ disabled, isStreaming, onCancel, onSend }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const content = value.trim();
    if (!content || disabled || isStreaming) return;

    setValue("");
    void onSend(content);
  };

  return (
    <form
      className="mx-auto mt-5 flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-2 shadow-[0_12px_30px_rgba(21,36,30,0.06)]"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label className="sr-only" htmlFor="project-prompt">Ask about this project</label>
      <textarea
        className="max-h-36 min-h-10 min-w-0 flex-1 resize-y bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted"
        disabled={disabled && !isStreaming}
        id="project-prompt"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Ask about this project"
        rows={1}
        value={value}
      />
      {isStreaming ? (
        <button
          aria-label="Stop generating answer"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--color-state-error)] text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-state-error)]"
          id="cancel-project-question"
          onClick={onCancel}
          type="button"
        >
          <Square fill="currentColor" size={15} />
        </button>
      ) : (
        <button
          aria-label="Send project question"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--color-bg-selected)] text-[var(--color-text-action)] transition hover:brightness-98 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || !value.trim()}
          id="send-project-question"
          type="submit"
        >
          <SendHorizontal size={17} />
        </button>
      )}
    </form>
  );
}
