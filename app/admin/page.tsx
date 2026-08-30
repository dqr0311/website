"use client";

import { useCallback, useState } from "react";
import { useMutation } from "convex/react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import { parseAwesomeMarkdown } from "../../lib/awesomeParser";
import { sampleTools } from "../../lib/sampleData";

type ImportTool = {
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: "free" | "freemium" | "paid";
  image?: string;
};

async function batchImport(
  upsertMany: (args: { items: ImportTool[] }) => Promise<{ inserted: number }>,
  tools: ImportTool[],
  onChunk?: (imported: number, total: number) => void
) {
  const chunkSize = 100;
  let imported = 0;

  for (let index = 0; index < tools.length; index += chunkSize) {
    const slice = tools.slice(index, index + chunkSize);
    const { inserted } = await upsertMany({ items: slice });
    imported += inserted;
    onChunk?.(imported, tools.length);
  }
}

function normalizeImports(markdown: string): ImportTool[] {
  return parseAwesomeMarkdown(markdown).map((tool) => ({
    name: tool.name,
    description: tool.description,
    url: tool.url,
    category: tool.category ?? "Uncategorized",
    tags: tool.tags ?? [],
    pricing: tool.pricing ?? "free",
    image: tool.image,
  }));
}

export default function AdminPage() {
  const upsertMany = useMutation(api.tools.upsertMany);
  const [sourceUrl, setSourceUrl] = useState(
    "https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md"
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (message: string) => {
    setLog((previous) => [...previous, message]);
  };

  const runImport = useCallback(
    async (tools: ImportTool[], label: string, resetLog = true) => {
      setLoading(true);
      setStatus("idle");
      if (resetLog) setLog([]);

      try {
        appendLog(`Starting ${label} import.`);
        appendLog(`Prepared ${tools.length} tools.`);
        await batchImport(upsertMany, tools, (done, total) => {
          appendLog(`Imported ${done}/${total}.`);
        });
        appendLog("Import complete.");
        setStatus("success");
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Import failed.";
        appendLog(message);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    },
    [upsertMany]
  );

  const importSample = () => {
    void runImport(sampleTools, "sample catalog");
  };

  const importFromGithub = useCallback(async () => {
    setLoading(true);
    setStatus("idle");
    setLog([]);

    try {
      appendLog(`Fetching ${sourceUrl}`);
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error(`Fetch failed with HTTP ${response.status}.`);

      const markdown = await response.text();
      const parsed = normalizeImports(markdown);
      await runImport(parsed, "GitHub Awesome list", false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Import failed.";
      appendLog(message);
      setStatus("error");
      setLoading(false);
    }
  }, [runImport, sourceUrl]);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-950">
          Back to catalog
        </Link>

        <header className="mt-6 border-b border-neutral-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Catalog operations
          </p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-950">Manage imports</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            Import curated tools into Convex from bundled sample data or a raw
            GitHub Awesome list.
          </p>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-950">Sample catalog</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Seed the database with the same curated tools used by the offline fallback.
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={importSample}
              className="mt-5 h-11 rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Import sample data
            </button>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-950">GitHub Awesome list</h2>
            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Raw README URL
              </span>
              <input
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                className="mt-1 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
                placeholder="https://raw.githubusercontent.com/.../README.md"
              />
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={importFromGithub}
              className="mt-5 h-11 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Importing..." : "Import from GitHub"}
            </button>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-neutral-950">Import log</h2>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                status === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : status === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {status}
            </span>
          </div>
          <div className="mt-4 min-h-40 rounded-md bg-neutral-950 p-4 font-mono text-xs leading-6 text-neutral-100">
            {log.length > 0 ? (
              log.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)
            ) : (
              <p className="text-neutral-400">No import activity yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
