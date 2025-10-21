// convex/tools.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";

// ---- 1) 列表查询（带筛选 + 分页） ----
export const list = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    tag: v.optional(v.string()),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const all: Doc<"tools">[] = await ctx.db
  .query("tools")
  .collect();
// 按创建时间倒序排序
all.sort((a, b) => b.createdAt - a.createdAt);

    const s = (args.search ?? "").toLowerCase();
    const c = (args.category ?? "").toLowerCase();
    const tg = (args.tag ?? "").toLowerCase();

    const filtered = all.filter((t) => {
      const okS =
        s.length === 0 ||
        t.name.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s);
      const okC = c.length === 0 || (t.category ?? "").toLowerCase() === c;
      const okT =
        tg.length === 0 ||
        (Array.isArray(t.tags) && t.tags.some((x) => (x ?? "").toLowerCase() === tg));
      return okS && okC && okT;
    });

    const page = Math.max(1, args.page ?? 1);
    const pageSize = Math.min(args.pageSize ?? 24, 100);
    const start = (page - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize),
      page,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      categories: [...new Set(all.map((t) => t.category))].sort(),
      tags: [
        ...new Set(
          all.flatMap((t) => (Array.isArray(t.tags) ? t.tags : []))
        )
      ].sort()
    };            // ← 结束 return 的对象
  }               // ← 结束 handler 的函数体（非常关键，缺它就会报你现在的错）
});               // ← 结束 query({...}) 的调用

// ---- 2) 分类列表 ----
export const categories = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("tools").collect();
    return [...new Set(all.map((t) => t.category))].sort();
  }
});

// ---- 3) 标签列表 ----
export const tags = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("tools").collect();
    const allTags = all.flatMap((t) => (Array.isArray(t.tags) ? t.tags : []));
    return [...new Set(allTags)].sort();
  }
});

// ---- 4) 批量导入（可选）----
// 如果暂时不用，可以注释掉这个 mutation，避免多处改动带来噪音
export const upsertMany = mutation({
  args: { items: v.array(v.any()) },
  handler: async (ctx, args) => {
    for (const raw of args.items) {
      const t = {
        name: String(raw?.name ?? ""),
        description: String(raw?.description ?? ""),
        url: String(raw?.url ?? ""),
        category: String(raw?.category ?? "Uncategorized"),
        tags: Array.isArray(raw?.tags) ? raw.tags.filter(Boolean).map(String) : [],
        pricing: String(raw?.pricing ?? "free"),
        image: raw?.image ? String(raw.image) : undefined,
        createdAt: Date.now()
      };
      await ctx.db.insert("tools", t);
    }
    return { inserted: args.items.length };
  }
});
