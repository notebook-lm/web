import { BookOpen, Sparkles } from "lucide-react";

export function ProductPreview() {
  return (
    <div className="rounded-2xl bg-white p-3 md:rotate-[-2deg]">
      <div className="flex h-8 items-center gap-1.5 border-b border-[#ecebe8] px-2">
        <i className="size-2 rounded-full bg-[#dededc]" />
        <i className="size-2 rounded-full bg-[#dededc]" />
        <i className="size-2 rounded-full bg-[#dededc]" />
        <span className="mx-auto text-[10px] font-bold text-muted">
          Coastal futures research
        </span>
      </div>
      <div className="grid min-h-[310px] grid-cols-[30%_70%]">
        <aside className="border-r border-[#ecebe8] bg-[#fbfbfa] p-3">
          <b className="text-[10px]">Sources</b>
          {["Climate synthesis", "Field notes", "Policy interviews"].map(
            (source) => (
              <div
                className="mt-4 flex gap-2 text-[9px] text-muted"
                key={source}
              >
                <BookOpen size={14} className="text-violet" />
                {source}
              </div>
            ),
          )}
        </aside>
        <section className="p-5">
          <p className="text-[10px] font-bold">Chat</p>
          <p className="ml-auto mt-6 max-w-[75%] rounded-lg rounded-br-sm bg-[#eeecff] p-3 text-[10px]">
            What are the strongest nature-based solutions?
          </p>
          <div className="mt-5 flex gap-2 text-[10px] leading-relaxed text-muted">
            <Sparkles size={15} className="shrink-0 text-violet" />
            Coastal wetlands and mangrove restoration offer consistent
            protection by reducing wave energy.
          </div>
        </section>
      </div>
    </div>
  );
}
