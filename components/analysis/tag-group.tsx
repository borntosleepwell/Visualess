type TagGroupProps = {
  label: string;
  tags: string[];
};

export function TagGroup({ label, tags }: TagGroupProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-[1.05rem] font-semibold text-zinc-50">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/45 px-3 py-1 text-sm font-light leading-none text-zinc-100 transition hover:border-white hover:bg-white/10"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
