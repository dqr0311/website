"use client";

import { useState } from "react";

type Props = {
  categories: string[];
  tags: string[];
  onChange: (f: { search: string; category: string; tag: string }) => void;
};

export default function SearchBar({ categories, tags, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onChange({ search: value, category, tag });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onChange({ search, category: value, tag });
  };

  const handleTagChange = (value: string) => {
    setTag(value);
    onChange({ search, category, tag: value });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        placeholder="Search tool name or description"
        className="w-full sm:w-72 rounded-lg border px-3 py-2"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <select
        className="rounded-lg border px-3 py-2"
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        className="rounded-lg border px-3 py-2"
        value={tag}
        onChange={(e) => handleTagChange(e.target.value)}
      >
        <option value="">All tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}

