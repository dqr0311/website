import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";

type Pricing = "free" | "freemium" | "paid";
type ToolDoc = Doc<"tools">;
type NormalizedTool = {
  _id: ToolDoc["_id"];
  _creationTime: number;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: Pricing;
  createdAt: number;
  updatedAt: number;
  image?: string;
};

const DEFAULT_CATEGORY = "Uncategorized";

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function nonEmptyStringValue(value: unknown, fallback: string) {
  const text = stringValue(value).trim();
  return text.length > 0 ? text : fallback;
}

function pricingValue(value: unknown): Pricing {
  return value === "paid" || value === "freemium" ? value : "free";
}

function tagsValue(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    .map((tag) => tag.trim());
}

function normalizeTool(raw: ToolDoc): NormalizedTool {
  const image = nonEmptyStringValue(raw.image, "");
  const tool = {
    _id: raw._id,
    _creationTime: raw._creationTime,
    name: nonEmptyStringValue(raw.name, "Untitled tool"),
    description: stringValue(raw.description),
    url: stringValue(raw.url),
    category: nonEmptyStringValue(raw.category, DEFAULT_CATEGORY),
    tags: tagsValue(raw.tags),
    pricing: pricingValue(raw.pricing),
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : 0,
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : 0,
  };

  return image ? { ...tool, image } : tool;
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter((value) => value.trim().length > 0))].sort();
}

export const list = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    tag: v.optional(v.string()),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = (await ctx.db.query("tools").collect())
      .map(normalizeTool)
      .sort((a, b) => b.createdAt - a.createdAt);

    const search = (args.search ?? "").toLowerCase();
    const category = (args.category ?? "").toLowerCase();
    const tag = (args.tag ?? "").toLowerCase();

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

    const page = Math.max(1, args.page ?? 1);
    const pageSize = Math.min(Math.max(1, args.pageSize ?? 24), 100);
    const start = (page - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize),
      page,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      categories: uniqueSorted(all.map((tool) => tool.category)),
      tags: uniqueSorted(all.flatMap((tool) => tool.tags)),
    };
  },
});

export const categories = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("tools").collect();
    return uniqueSorted(all.map((tool) => normalizeTool(tool).category));
  },
});

export const tags = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("tools").collect();
    return uniqueSorted(all.flatMap((tool) => normalizeTool(tool).tags));
  },
});

export const upsertMany = mutation({
  args: { items: v.array(v.any()) },
  handler: async (ctx, args) => {
    for (const raw of args.items) {
      const image = nonEmptyStringValue(raw?.image, "");
      const tool = {
        name: nonEmptyStringValue(raw?.name, "Untitled tool"),
        description: stringValue(raw?.description),
        url: stringValue(raw?.url),
        category: nonEmptyStringValue(raw?.category, DEFAULT_CATEGORY),
        tags: tagsValue(raw?.tags),
        pricing: pricingValue(String(raw?.pricing ?? "free").toLowerCase()),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await ctx.db.insert("tools", image ? { ...tool, image } : tool);
    }

    return { inserted: args.items.length };
  },
});
