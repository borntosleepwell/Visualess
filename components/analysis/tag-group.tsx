type TagGroupProps = {
  label: string;
  tags: string[];
};

export function TagGroup({ label, tags }: TagGroupProps) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-medium uppercase text-zinc-500">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
