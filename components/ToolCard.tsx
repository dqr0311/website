"use client";

type Props = {
  name: string;
  description: string;
  url: string;
  tags: string[];
  pricing: "free" | "freemium" | "paid";
  image?: string;
};

export default function ToolCard({ name, description, url, tags, pricing, image }: Props) {
  return (
    <a href={url} target="_blank" rel="noreferrer"
       className="block rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      {image ? <img src={image} alt={name} className="h-36 w-full rounded-lg object-cover mb-3" /> : null}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-xs rounded-full border px-2 py-0.5">{pricing}</span>
      </div>
      <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {tags.map((t) => (
          <span key={t} className="text-xs bg-neutral-100 px-2 py-0.5 rounded">{t}</span>
        ))}
      </div>
    </a>
  );
}
