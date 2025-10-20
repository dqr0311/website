"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";

// 组件在项目根的 components/ 目录
import  SearchBar  from "../components/SearchBar";
import  ToolCard  from "../components/ToolCard";

export default function Home() {
  const categories = useQuery(api.tools.categories) ?? [];
  const tags = useQuery(api.tools.tags) ?? [];

  const [filters, setFilters] = useState({ search: "", category: "", tag: "" });
  const [page, setPage] = useState(1);

  const data = useQuery(api.tools.list, { ...filters, page, pageSize: 24 });

  useEffect(() => setPage(1), [filters]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">AI Tool Catalog</h1>
      <p className="mt-1 text-neutral-600">Search, filter, and discover useful AI tools.</p>

      <div className="mt-6">
        <SearchBar categories={categories} tags={tags} onChange={setFilters} />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.items?.map((t) => (
          <ToolCard
            key={t._id}
            name={t.name}
            description={t.description}
            url={t.url}
            tags={t.tags}
            pricing={t.pricing}
            image={t.image}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          className="rounded-lg border px-3 py-1 disabled:opacity-50"
          disabled={!data || page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous Page
        </button>
        <span className="text-sm">
          {data ? `${page} / ${data.totalPages}` : "Loading…"}
        </span>
        <button
          className="rounded-lg border px-3 py-1 disabled:opacity-50"
          disabled={!data || page >= (data?.totalPages ?? 1)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next Page
        </button>
      </div>
    </main>
  );
}
