"use client";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { useEffect, useMemo, useState } from "react";

import SearchBar from "../components/SearchBar";
import ToolCard from "../components/ToolCard";
import { sampleTools } from "../lib/sampleData";

type Tool = {
  _id: string;
  name: string;
  description: string;
  url: string;
  tags: string[];
  pricing: "free" | "freemium" | "paid";
  image?: string;
};

type ToolsData = {
  items: Tool[];
  page: number;
  totalPages: number;
  categories: string[];
  tags: string[];
};

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort();
}

function getFallbackData(
  filters: { search: string; category: string; tag: string },
  page: number,
  pageSize: number
): ToolsData {
  const search = filters.search.trim().toLowerCase();
  const category = filters.category.toLowerCase();
  const tag = filters.tag.toLowerCase();
  const all = sampleTools.map((tool, index) => ({ ...tool, _id: `sample-${index}` }));

  const filtered = all.filter((tool) => {
    const matchesSearch =
      search.length === 0 ||
      tool.name.toLowerCase().includes(search) ||
      tool.description.toLowerCase().includes(search);
    const matchesCategory =
      category.length === 0 || tool.category.toLowerCase() === category;
    const matchesTag =
      tag.length === 0 || tool.tags.some((value) => value.toLowerCase() === tag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    page: currentPage,
    totalPages,
    categories: uniqueSorted(all.map((tool) => tool.category)),
    tags: uniqueSorted(all.flatMap((tool) => tool.tags)),
  };
}

export default function Home() {
  const convex = useMemo(
    () => new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!),
    []
  );
  const [filters, setFilters] = useState({ search: "", category: "", tag: "" });
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ToolsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => setPage(1), [filters]);

  useEffect(() => {
    let active = true;
    setError("");
    setData(null);

    let timeoutId: number;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error("Timed out loading tools")), 8000);
    });

    void Promise.race([
      convex.query(api.tools.list, { ...filters, page, pageSize: 24 }),
      timeout,
    ])
      .then((result) => {
        if (!active) return;
        window.clearTimeout(timeoutId);
        setData(result);
      })
      .catch((err: unknown) => {
        if (!active) return;
        window.clearTimeout(timeoutId);
        console.error("Failed to load tools", err);
        setData(getFallbackData(filters, page, 24));
        setError("Showing a temporary catalog while the database is unavailable.");
      });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [convex, filters, page]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">AI Tool Catalog</h1>
      <p className="mt-1 text-neutral-600">Search, filter, and discover useful AI tools.</p>

      <div className="mt-6">
        <SearchBar
          categories={data?.categories ?? []}
          tags={data?.tags ?? []}
          onChange={setFilters}
        />
      </div>

      {error ? (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      ) : null}

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

      {data && data.items.length === 0 ? (
        <p className="mt-8 text-center text-sm text-neutral-500">No tools found.</p>
      ) : null}

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          className="rounded-lg border px-3 py-1 disabled:opacity-50"
          disabled={!data || page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous Page
        </button>
        <span className="text-sm">
          {data ? `${data.page} / ${data.totalPages}` : "Loading…"}
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
