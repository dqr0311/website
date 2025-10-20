"use client";

type Props = {
  categories: string[];
  tags: string[];
  onChange: (f: { search: string; category: string; tag: string }) => void;
};

export default function SearchBar({ categories, tags, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        placeholder="Search tool name or description"
        className="w-full sm:w-72 rounded-lg border px-3 py-2"
        onChange={(e) => onChange({ search: e.target.value, category: "", tag: "" })}
      />
      <select
        className="rounded-lg border px-3 py-2"
        onChange={(e) => onChange({ search: "", category: e.target.value, tag: "" })}
        defaultValue=""
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        className="rounded-lg border px-3 py-2"
        onChange={(e) => onChange({ search: "", category: "", tag: e.target.value })}
        defaultValue=""
      >
        <option value="">All tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}

