// convex/tools.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

type Pricing = "free" | "freemium" | "paid";

function normalizePricing(p?: string | null): Pricing | undefined {
  if (!p) return undefined;
  const s = String(p).toLowerCase();
  if (s === "free" || s === "freemium" || s === "paid") return s as Pricing;
  // 常见别名做归一化
  if (["open-source", "opensource", "oss"].includes(s)) return "free";
  if (["trial", "beta"].includes(s)) return "freemium";
  return "freemium";
}

/**
 * 列表查询：支持搜索 / 分类 / 标签 / 分页
 * 页面上用法例子：
 * useQuery(api.tools.list, { page, pageSize, search, category, tag })
 */
export const list = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    tag: v.optional(v.string()),
    page: v.optional(v.number()),     // 1 基
    pageSize: v.optional(v.number()), // 默认 6
  },
  handler: async (ctx, args) => {
    const page = Math.max(1, args.page ?? 1);
    const pageSize = Math.min(Math.max(1, args.pageSize ?? 6), 50);

    const q = await ctx.db.query("tools").collect();

    // 过滤
    const kw = (args.search ?? "").trim().toLowerCase();
    const category = (args.category ?? "").trim();
    const tag = (args.tag ?? "").trim();

    let filtered = q.filter((t) => {
      if (kw) {
        const inName = t.name?.toLowerCase().includes(kw);
        const inDesc = (t.description ?? "").toLowerCase().includes(kw);
        if (!inName && !inDesc) return false;
      }
      if (category) {
        if ((t.category ?? "") !== category) return false;
      }
      if (tag) {
        const tags = t.tags ?? [];
        if (!tags.includes(tag)) return false;
      }
      return true;
    });

    // 简单排序：名称升序
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      page,
      totalPages,
      total,
    };
  },
});

/**
 * 分类聚合：用于下拉框
 * useQuery(api.tools.categories)
 */
export const categories = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tools").collect();
    const set = new Set<string>();
    for (const t of all) {
      if (t.category && t.category.trim()) set.add(t.category.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  },
});

/**
 * 标签聚合：用于下拉框
 * useQuery(api.tools.tags)
 */
export const tags = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tools").collect();
    const set = new Set<string>();
    for (const t of all) {
      for (const tag of t.tags ?? []) {
        const s = String(tag).trim();
        if (s) set.add(s);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  },
});

/**
 * 批量导入/更新（按 url 去重），已做字段容错与分批
 * admin 页面：useMutation(api.tools.upsertMany)
 */
export const upsertMany = mutation({
  args: {
    tools: v.array(
      v.object({
        name: v.string(),
        description: v.optional(v.string()),
        url: v.string(),
        category: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        pricing: v.optional(v.union(v.literal("free"), v.literal("freemium"), v.literal("paid"))),
        image: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const chunkSize = 50; // 一批 50 条，避免超限
    for (let i = 0; i < args.tools.length; i += chunkSize) {
      const chunk = args.tools.slice(i, i + chunkSize);
      for (const raw of chunk) {
        const doc = {
          name: raw.name,
          description: raw.description ?? undefined,
          url: raw.url,
          category: raw.category ?? undefined,
          tags: (raw.tags ?? []).map((t) => String(t)).filter(Boolean),
          pricing: normalizePricing(raw.pricing),
          image: raw.image ?? undefined,
        };

        // 以 url upsert（需在 schema 里有 by_url 索引）
        const existing = await ctx.db
          .query("tools")
          .withIndex("by_url", (q) => q.eq("url", doc.url))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, doc);
        } else {
          await ctx.db.insert("tools", doc);
        }
      }
    }
  },
});

/**
 * 可选：清空全部数据（谨慎）
 * 在管理端按需挂一个按钮调用即可
 */
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tools").collect();
    for (const t of all) {
      await ctx.db.delete(t._id);
    }
  },
});

