"use client";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { useEffect, useMemo, useState } from "react";

import SearchBar from "../components/SearchBar";
import ToolCard from "../components/ToolCard";
import { sampleTools } from "../lib/sampleData";

type Pricing = "free" | "freemium" | "paid";

type Filters = {
  search: string;
  category: string;
  tag: string;
};

type Tool = {
  _id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: Pricing;
  image?: string;
};

type ToolsData = {
  items: Tool[];
  page: number;
  totalItems: number;
  totalPages: number;
  categories: string[];
  tags: string[];
};

const PAGE_SIZE = 12;
const INITIAL_FILTERS: Filters = { search: "", category: "", tag: "" };

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort();
}

function getFallbackData(filters: Filters, page: number): ToolsData {
  const search = filters.search.trim().toLowerCase();
  const category = filters.category.toLowerCase();
  const tag = filters.tag.toLowerCase();
  const all = sampleTools.map((tool, index) => ({ ...tool, _id: `sample-${index}` }));

  const filtered = all.filter((tool) => {
    const matchesSearch =
      search.length === 0 ||
      tool.name.toLowerCase().includes(search) ||
      tool.description.toLowerCase().includes(search) ||
      tool.tags.some((value) => value.toLowerCase().includes(search));
    const matchesCategory =
      category.length === 0 || tool.category.toLowerCase() === category;
    const matchesTag =
      tag.length === 0 || tool.tags.some((value) => value.toLowerCase() === tag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;

  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    page: currentPage,
    totalItems: filtered.length,
    totalPages,
    categories: uniqueSorted(all.map((tool) => tool.category)),
    tags: uniqueSorted(all.flatMap((tool) => tool.tags)),
  };
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="min-h-64 animate-pulse rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="h-12 w-12 rounded-lg bg-neutral-200" />
            <div className="h-6 w-20 rounded-full bg-neutral-200" />
          </div>
          <div className="mt-6 h-3 w-24 rounded bg-neutral-200" />
          <div className="mt-3 h-5 w-40 rounded bg-neutral-200" />
          <div className="mt-4 space-y-2">
            <div className="h-3 rounded bg-neutral-200" />
            <div className="h-3 rounded bg-neutral-200" />
            <div className="h-3 w-2/3 rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const convex = useMemo(
    () => new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!),
    []
  );
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ToolsData | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [hasLiveDataFailed, setHasLiveDataFailed] = useState(false);

  useEffect(() => setPage(1), [filters]);

  useEffect(() => {
    let active = true;

    if (hasLiveDataFailed) {
      setData(getFallbackData(filters, page));
      setIsFallback(true);
      return () => {
        active = false;
      };
    }

    setData(null);
    setIsFallback(false);

    let timeoutId: number;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error("Timed out loading tools")), 8000);
    });

    void Promise.race([
      convex.query(api.tools.list, { ...filters, page, pageSize: PAGE_SIZE }),
      timeout,
    ])
      .then((result) => {
        if (!active) return;
        window.clearTimeout(timeoutId);
        setData({
          ...result,
          totalItems: result.totalItems ?? result.items.length,
        });
      })
      .catch((err: unknown) => {
        if (!active) return;
        window.clearTimeout(timeoutId);
        console.error("Failed to load tools", err);
        setData(getFallbackData(filters, page));
        setIsFallback(true);
        setHasLiveDataFailed(true);
      });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [convex, filters, hasLiveDataFailed, page]);

  const categories = data?.categories ?? [];
  const tags = data?.tags ?? [];
  const visibleTools = data?.items ?? [];
  const topTags = tags.slice(0, 8);
  const totalTools = data?.totalItems ?? 0;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-neutral-200 pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Curated AI directory
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-normal text-neutral-950 sm:text-5xl">
                AI Tool Catalog
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
                Discover practical AI products for research, design, coding, automation,
                productivity, audio, and video work.
              </p>
            </div>

            <a
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
            >
              Manage catalog
            </a>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <dt className="text-sm text-neutral-500">Tools</dt>
              <dd className="mt-1 text-2xl font-semibold text-neutral-950">{totalTools}</dd>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <dt className="text-sm text-neutral-500">Categories</dt>
              <dd className="mt-1 text-2xl font-semibold text-neutral-950">{categories.length}</dd>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <dt className="text-sm text-neutral-500">Tags</dt>
              <dd className="mt-1 text-2xl font-semibold text-neutral-950">{tags.length}</dd>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <dt className="text-sm text-neutral-500">Source</dt>
              <dd className="mt-1 text-lg font-semibold text-neutral-950">
                {isFallback ? "Curated" : data ? "Database" : "Loading"}
              </dd>
            </div>
          </dl>
        </header>

        <section className="sticky top-0 z-10 -mx-4 border-b border-neutral-200 bg-neutral-50/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <SearchBar
            categories={categories}
            tags={tags}
            filters={filters}
            resultCount={visibleTools.length}
            totalCount={totalTools}
            onChange={setFilters}
          />
        </section>

        {topTags.length > 0 ? (
          <section className="py-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">Popular tags</span>
              {topTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    filters.tag === tag
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                  }`}
                  onClick={() => setFilters({ ...filters, tag: filters.tag === tag ? "" : tag })}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {isFallback ? (
          <div className="mb-5 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <p>
              The live database is unavailable, so this page is showing a curated
              temporary catalog.
            </p>
            <button
              type="button"
              className="h-9 rounded-md border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-950 transition hover:border-amber-500"
              onClick={() => setHasLiveDataFailed(false)}
            >
              Retry live data
            </button>
          </div>
        ) : null}

        <section className="pb-10">
          {!data ? (
            <LoadingGrid />
          ) : visibleTools.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleTools.map((tool) => (
                <ToolCard
                  key={tool._id}
                  name={tool.name}
                  description={tool.description}
                  url={tool.url}
                  category={tool.category}
                  tags={tool.tags}
                  pricing={tool.pricing}
                  image={tool.image}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-white py-16 text-center">
              <h2 className="text-lg font-semibold text-neutral-950">No matching tools</h2>
              <p className="mt-2 text-sm text-neutral-500">
                Adjust your search or clear filters to browse the catalog.
              </p>
              <button
                type="button"
                className="mt-5 rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setFilters(INITIAL_FILTERS)}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <nav className="flex items-center justify-center gap-3 border-t border-neutral-200 py-6">
          <button
            className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!data || data.page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            Previous
          </button>
          <span className="min-w-20 text-center text-sm font-medium text-neutral-700">
            {data ? `${data.page} / ${data.totalPages}` : "Loading"}
          </span>
          <button
            className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!data || data.page >= data.totalPages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </button>
        </nav>
      </div>
    </main>
  );
}
