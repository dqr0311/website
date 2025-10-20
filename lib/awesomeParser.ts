// lib/awesomeParser.ts
export type ParsedTool = {
  name: string;
  url: string;
  description: string;
  category?: string;
  tags?: string[];
  pricing?: "free" | "freemium" | "paid";
  image?: string;
};

/**
 * Parse markdown lines like:
 * - [Name](https://site.com) - description...
 * Uses latest ##/### heading as category.
 */
export function parseAwesomeMarkdown(md: string): ParsedTool[] {
  const lines = md.split("\n");
  let currentCategory = "";
  const tools: ParsedTool[] = [];

  const itemRegex =
    /^\s*[-*+]\s+\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)\s*(?:[-–—:]\s*)?(.*)$/;

  for (const line of lines) {
    const h = /^#{2,4}\s+(.+?)\s*$/.exec(line);
    if (h) {
      currentCategory = h[1].trim();
      continue;
    }

    const m = itemRegex.exec(line);
    if (m) {
      const name = m[1].trim();
      const url = m[2].trim();
      const description = (m[3] ?? "").trim();

      const low = description.toLowerCase();
      const pricing: "free" | "freemium" | "paid" =
        low.includes("free") ? "free" : low.includes("paid") ? "paid" : "freemium";

      const tags: string[] = [];
      if (currentCategory) tags.push(currentCategory);

      tools.push({
        name,
        url,
        description,
        category: currentCategory || "Uncategorized",
        tags,
        pricing,
      });
    }
  }

  const seen = new Set<string>();
  return tools.filter(t => (seen.has(t.url) ? false : (seen.add(t.url), true)));
}

// 既导出具名，也导出默认，防止引入方式不一致造成的报错
export default parseAwesomeMarkdown;
