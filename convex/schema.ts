import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tools: defineTable({
    name: v.string(),
    description: v.string(),
    url: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    pricing: v.union(v.literal("free"), v.literal("freemium"), v.literal("paid")),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_url", ["url"])
    .index("by_createdAt", ["createdAt"]),
});
