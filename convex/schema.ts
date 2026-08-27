import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tools: defineTable({
    name: v.optional(v.any()),
    description: v.optional(v.any()),
    url: v.optional(v.any()),
    category: v.optional(v.any()),
    tags: v.optional(v.any()),
    pricing: v.optional(v.any()),
    image: v.optional(v.any()),
    createdAt: v.optional(v.any()),
    updatedAt: v.optional(v.any()),
  })
    .index("by_category", ["category"])
    .index("by_url", ["url"])
    .index("by_createdAt", ["createdAt"]),
});
