// convex/tools.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 与 schema.ts 保持一致的字段定义
const Tool = {
  name: v.string(),
  description: v.string(),
  url: v.string(),
  category: v.string(),
  tags: v.array(v.string()),
  pricing: v.union(v.literal("free"), v.literal("freemium"), v.literal("paid")),
  image: v.optional(v.string()),
};

// 单条 upsert：按 url 去重
export const add = mutation({
  args: { ...Tool },
  handler: async (ctx, args) => {
    const now = Date.now();

    // 不用索引，用 filter 精确匹配 url
    const existed = await ctx.db
      .query("tools")
      .filter((q) => q.eq(q.field("url"), args.url))
      .unique();

    if (existed) {
      await ctx.db.patch(existed._id, { ...args, updatedAt: now });
      return existed._id;
    }
    return await ctx.db.insert("tools", { ...args, createdAt: now, updatedAt: now });
  },
});

// 批量导入：就地 upsert（不在服务端再调用 mutation）
export const upsertMany = mutation({
  args: { tools: v.array(v.object(Tool)) },
  handler: async (ctx, { tools }) => {
    const now = Date.now();

    for (const t of tools) {
      const existed = await ctx.db
        .query("tools")
        .filter((q) => q.eq(q.field("url"), t.url))
        .unique();

      if (existed) {
        await ctx.db.patch(existed._id, { ...t, updatedAt: now });
      } else {
        await ctx.db.insert("tools", { ...t, createdAt: now, updatedAt: now });
      }
    }
    return { count: tools.length };
  },
});

// 列表 + 搜索/筛选 + 分页（内存排序，先跑通）
export const list = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    tag: v.optional(v.string()),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, { search, category, tag, page = 1, pageSize = 24 }) => {
    const rows = await ctx.db.query("tools").collect();

    // 按创建时间倒序（不依赖索引）
    rows.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

    const s = (search ?? "").trim().toLowerCase();
    const match = (str?: string) => (str ?? "").toLowerCase().includes(s);

    const filtered = rows.filter((r) => {
      const bySearch = s
        ? match(r.name) || match(r.description) || (r.tags ?? []).some((x: string) => match(x))
        : true;
      const byCat = category ? r.category === category : true;
      const byTag = tag ? r.tags.includes(tag) : true;
      return bySearch && byCat && byTag;
    });

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      items: filtered.slice(start, end),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },
});

// 分类列表
export const categories = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("tools").collect();
    return Array.from(new Set(rows.map((r) => r.category))).sort();
  },
});

// 标签列表
export const tags = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("tools").collect();
    return Array.from(new Set(rows.flatMap((r) => r.tags))).sort();
  },
});
