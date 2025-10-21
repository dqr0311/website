"use client";
import React, { useCallback, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type Tool = {
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: string;
  image?: string;
};

// 简单解析 mahseema/awesome-ai-tools 的 README.md 列表项：
//  - [Name](https://url) — description （行内可能带标签/分类，不同 PR 可能略有出入，做兜底即可）
function parseAwesomeMarkdown(md: string): Tool[] {
  const lines = md.split("\n");
  const tools: Tool[] = [];

  const linkRe = /^\s*[-*]\s+\[([^\]]+)\]\((https?:\/\/[^)]+)\)\s*[—-]\s*(.+)$/;

  for (const raw of lines) {
    const m = raw.match(linkRe);
    if (!m) continue;

    const name = m[1].trim();
    const url = m[2].trim();
    const rest = m[3].trim();

    // 简单抽取标签/定价（README 没有统一字段，这里主要兜底）
    const lower = rest.toLowerCase();
    const pricing =
      lower.includes("paid") ? "paid" :
      lower.includes("freemium") ? "freemium" :
      "free";

    // 尝试把括号里的逗号分隔当标签（例如 (NLP, Assistant)）
    const paren = rest.match(/\(([^)]+)\)/);
    const tags = paren ? paren[1].split(/[，,]/).map(s => s.trim()).filter(Boolean) : [];

    const description = rest.replace(/\s*\([^)]+\)\s*$/, ""); // 去掉末尾括号
    const category = "Uncategorized";

    tools.push({ name, description, url, category, tags, pricing });
  }

  // 去重（按 url）
  const seen = new Set<string>();
  return tools.filter(t => {
    if (seen.has(t.url)) return false;
    seen.add(t.url);
    return true;
  });
}

// 分批，避免参数过大 / 超时
async function batchImport(
  upsertMany: (args: { items: Tool[] }) => Promise<{ inserted: number }>,
  all: Tool[],
  onChunk?: (imported: number, total: number) => void
) {
  const chunkSize = 100; // 每批 100 个（可调小/大）
  let imported = 0;

  for (let i = 0; i < all.length; i += chunkSize) {
    const slice = all.slice(i, i + chunkSize);
    const { inserted } = await upsertMany({ items: slice });
    imported += inserted;
    onChunk?.(imported, all.length);
  }
}

export default function AdminPage() {
  const upsertMany = useMutation(api.tools.upsertMany);

  const [sourceUrl, setSourceUrl] = useState(
    "https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md"
  );
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState("");

  const appendLog = (s: string) => setLog(prev => prev + s + "\n");

  const importFromGithub = useCallback(async () => {
    try {
      setLoading(true);
      setLog("");

      appendLog(`Fetching README: ${sourceUrl}`);
      const res = await fetch(sourceUrl);
      if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status}`);
      const md = await res.text();

      const parsed = parseAwesomeMarkdown(md);
      appendLog(`Parsed ${parsed.length} items.`);

      await batchImport(upsertMany, parsed, (done, total) => {
        appendLog(`Upserted ${done}/${total}`);
      });

      alert("Import OK! Go check the home page.");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Import failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  }, [sourceUrl, upsertMany]);

  const importSample = async () => {
    // 你原来的 sample 数据按钮也可以走同一个 upsertMany（不再需要 upsert 单体）
    const sample: Tool[] = [
      {
        name: "ChatGPT",
        description: "Conversational AI assistant by OpenAI.",
        url: "https://chat.openai.com/",
        category: "Assistant",
        tags: ["NLP", "Assistant"],
        pricing: "freemium",
        image: "",
      },
      {
        name: "Hugging Face",
        description: "Models and datasets hub for ML.",
        url: "https://huggingface.co",
        category: "Models",
        tags: ["Models", "Datasets"],
        pricing: "free",
      },
    ];
    const { inserted } = await upsertMany({ items: sample });
    alert(`Imported ${inserted ?? sample.length} items.`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Admin (for development)</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Import sample data</h2>
        <button disabled={loading} onClick={importSample}
          className="mt-3 rounded bg-black px-4 py-2 text-white disabled:opacity-50">
          Import Sample Data
        </button>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Import from GitHub</h2>
        <input
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          className="mt-3 w-full rounded border px-3 py-2"
          placeholder="https://raw.githubusercontent.com/.../README.md"
        />
        <button disabled={loading} onClick={importFromGithub}
          className="mt-3 rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50">
          {loading ? "Importing..." : "Import from GitHub"}
        </button>

        <pre className="mt-4 rounded bg-gray-100 p-3 text-sm whitespace-pre-wrap">
{log}
        </pre>
      </section>
    </main>
  );
}
