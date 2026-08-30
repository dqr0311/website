"use client";

import Image from "next/image";

type Props = {
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: "free" | "freemium" | "paid";
  image?: string;
};

const pricingLabel = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
};

const pricingStyle = {
  free: "border-emerald-200 bg-emerald-50 text-emerald-800",
  freemium: "border-blue-200 bg-blue-50 text-blue-800",
  paid: "border-neutral-300 bg-neutral-100 text-neutral-800",
};

export default function ToolCard({
  name,
  description,
  url,
  category,
  tags,
  pricing,
  image,
}: Props) {
  const shownTags = tags.slice(0, 3);
  const extraTags = Math.max(0, tags.length - shownTags.length);
  const initial = name.trim().charAt(0).toUpperCase() || "A";
  const host = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "Open tool";
    }
  })();

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-64 flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        {image ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
            <Image
              src={image}
              alt={`${name} logo`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-lg font-semibold text-white">
            {initial}
          </div>
        )}

        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${pricingStyle[pricing]}`}>
          {pricingLabel[pricing]}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {category}
        </p>
        <h3 className="mt-1 text-lg font-semibold leading-snug text-neutral-950">
          {name}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
          {description}
        </p>
      </div>

      <div className="mt-auto pt-5">
        <div className="flex min-h-7 flex-wrap gap-1.5">
          {shownTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700"
            >
              {tag}
            </span>
          ))}
          {extraTags > 0 ? (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
              +{extraTags}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 text-sm">
          <span className="max-w-44 truncate text-neutral-500">
            {host}
          </span>
          <span className="font-semibold text-neutral-950 transition group-hover:translate-x-0.5">
            Visit
          </span>
        </div>
      </div>
    </a>
  );
}
