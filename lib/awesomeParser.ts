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

const bulletRe =
  /^\s*[-*]\s+\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)\s*(?:[-–—]\s*(.+))?$/;

export function parseAwesomeMarkdown(md: string): ParsedTool[] {
  const tools: ParsedTool[] = [];
  const seen = new Set<string>();
  let currentCategory = "";

  const lines = md.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();

    // ## / ### 标题作为 category
    const h = /^(?:#{2,3})\s+(.+?)\s*$/.exec(line);
    if (h) {
      currentCategory = h[1].trim();
      continue;
    }

    const m = bulletRe.exec(line);
    if (!m) continue;

    const [, name, url, descRaw] = m;
    if (seen.has(url)) continue;
    seen.add(url);

    const description = (descRaw ?? "").trim();
    tools.push({
      name: name.trim(),
      url: url.trim(),
      description: description.length ? description : "No description.",
      category: currentCategory || undefined,
      // 下面两项 Awesome 列表通常没有显式标注，留空或使用你自定义策略
      tags: undefined,
      pricing: undefined,
    });
  }
  return tools;
}
