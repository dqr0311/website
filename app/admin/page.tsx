"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { sampleTools } from "../../lib/sampleData";
import { parseAwesomeMarkdown } from "../../lib/awesomeParser";

export default function Admin() {
  const upsert = useMutation(api.tools.upsertMany);
  const [sourceUrl, setSourceUrl] = useState(
    "https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md"
  );
  const [loading, setLoading] = useState(false);

  async function importFromGithub() {
    try {
      setLoading(true);
      const res = await fetch(sourceUrl);
      if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status}`);
      const md = await res.text();

      const parsed = parseAwesomeMarkdown(md);
      if (parsed.length === 0) {
        alert("Parsed 0 items. Please check the raw README.md URL.");
        return;
      }

      const batch = parsed.map((t) => ({
        name: t.name,
        description: t.description || "",
        url: t.url,
        category: t.category || "Uncategorized",
        tags: t.tags ?? [],
        pricing: (t.pricing ?? "freemium") as "free" | "freemium" | "paid",
        image: t.image,
      }));

      const result = await upsert({ tools: batch });
      alert(`Imported ${result?.count ?? batch.length} items. Go check the home page!`);
    } catch (e: unknown) {
     const msg = e instanceof Error ? e.message : "Import failed";
  alert(msg);
} finally {
  setLoading(false);
}
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">Admin (for development)</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Import sample data</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Quick way to verify the UI works.
        </p>
        <button
          onClick={async () => {
            await upsert({ tools: sampleTools });
            alert("Sample data imported. Check the home page!");
          }}
          className="mt-3 rounded-xl bg-black text-white px-4 py-2"
        >
          Import Sample Data
        </button>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Import from GitHub</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Paste a raw README.md URL from an awesome list (default is
          <code className="mx-1">mahseema/awesome-ai-tools</code>).
        </p>

        <input
          className="mt-3 w-full rounded-lg border px-3 py-2"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://raw.githubusercontent.com/.../README.md"
        />

        <button
          onClick={importFromGithub}
          disabled={loading}
          className="mt-3 rounded-xl bg-indigo-600 text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Importing…" : "Import from GitHub"}
        </button>
      </section>
    </main>
  );
}

