"use client";

type Filters = {
  search: string;
  category: string;
  tag: string;
};

type Props = {
  categories: string[];
  tags: string[];
  filters: Filters;
  resultCount: number;
  totalCount: number;
  onChange: (filters: Filters) => void;
};

export default function SearchBar({
  categories,
  tags,
  filters,
  resultCount,
  totalCount,
  onChange,
}: Props) {
  const hasFilters = Boolean(filters.search || filters.category || filters.tag);

  const update = (next: Partial<Filters>) => {
    onChange({ ...filters, ...next });
  };

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Search
          </span>
          <input
            placeholder="Search tools, workflows, or use cases"
            className="mt-1 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
          />
        </label>

        <label className="min-w-44">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Category
          </span>
          <select
            className="mt-1 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            value={filters.category}
            onChange={(event) => update({ category: event.target.value })}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-44">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Tag
          </span>
          <select
            className="mt-1 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            value={filters.tag}
            onChange={(event) => update({ tag: event.target.value })}
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="h-11 rounded-md border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasFilters}
          onClick={() => onChange({ search: "", category: "", tag: "" })}
        >
          Clear
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
        <span className="font-medium text-neutral-900">
          {resultCount} of {totalCount} tools
        </span>
        {filters.category ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-800">{filters.category}</span> : null}
        {filters.tag ? <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-800">{filters.tag}</span> : null}
        {filters.search ? (
          <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-900">
            &quot;{filters.search}&quot;
          </span>
        ) : null}
      </div>
    </section>
  );
}
