import type { Metadata } from "next";
import "./globals.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const metadata: Metadata = {
title: "AI Tools Directory",
description: "A simple directory of AI tools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="zh-CN">
<body className="min-h-screen bg-neutral-50 text-neutral-900">
<ConvexProvider client={convex}>{children}</ConvexProvider>
</body>
</html>
);
}