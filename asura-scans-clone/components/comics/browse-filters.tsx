"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { genres } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statuses = ["ALL", "ONGOING", "COMPLETED", "HIATUS"];
const types = ["ALL", "MANGA", "MANHWA", "MANHUA"];
const sorts = [
  { value: "latest", label: "Latest" },
  { value: "az", label: "A-Z" },
  { value: "rating", label: "Rating" },
  { value: "views", label: "Views" },
];

export function BrowseFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [selectedGenres, setSelectedGenres] = useState(params.get("genres")?.split(",").filter(Boolean) ?? []);
  const status = params.get("status") ?? "ALL";
  const type = params.get("type") ?? "ALL";
  const sort = params.get("sort") ?? "latest";

  const chips = useMemo(() => selectedGenres.map((slug) => genres.find((genre) => genre.slug === slug)?.name ?? slug), [selectedGenres]);

  function update(next: Record<string, string | undefined>, genreOverride = selectedGenres) {
    const query = new URLSearchParams(params.toString());
    if (genreOverride.length) query.set("genres", genreOverride.join(","));
    else query.delete("genres");
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "ALL") query.delete(key);
      else query.set(key, value);
    });
    const qs = query.toString();
    router.push(qs ? `/browse?${qs}` : "/browse");
  }

  function toggleGenre(slug: string) {
    const next = selectedGenres.includes(slug) ? selectedGenres.filter((item) => item !== slug) : [...selectedGenres, slug];
    setSelectedGenres(next);
    update({}, next);
  }

  return (
    <div className="mb-8 rounded-xl border border-brand-surface bg-brand-card p-4">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-secondary">Genre</p>
          <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto pr-1">
            {genres.map((genre) => (
              <button key={genre.id} type="button" onClick={() => toggleGenre(genre.slug)} className={`rounded-full border px-3 py-1 text-xs ${selectedGenres.includes(genre.slug) ? "border-brand-primary bg-brand-primary text-white" : "border-brand-surface text-brand-secondary hover:border-brand-primary hover:text-white"}`}>
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        <FilterSelect label="Status" value={status} values={statuses} onChange={(value) => update({ status: value })} />
        <FilterSelect label="Type" value={type} values={types} onChange={(value) => update({ type: value })} />
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-secondary">Sort by</p>
          <Select value={sort} onValueChange={(value) => update({ sort: value })}>
            <SelectTrigger className="border-brand-surface bg-brand-background text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="border-brand-surface bg-brand-card text-white">
              {sorts.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {chips.length || status !== "ALL" || type !== "ALL" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((label, index) => (
            <Badge key={label} className="gap-1 bg-brand-primary text-white">
              {label}
              <button aria-label={`Remove ${label}`} onClick={() => toggleGenre(selectedGenres[index])}><X className="h-3 w-3" /></button>
            </Badge>
          ))}
          {status !== "ALL" ? <Badge className="bg-brand-hover text-white">{status}</Badge> : null}
          {type !== "ALL" ? <Badge className="bg-brand-hover text-white">{type}</Badge> : null}
          <Button variant="ghost" size="sm" onClick={() => { setSelectedGenres([]); router.push('/browse'); }} className="h-6 text-xs text-brand-secondary hover:text-white">Clear all</Button>
        </div>
      ) : null}
    </div>
  );
}

function FilterSelect({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-secondary">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-brand-surface bg-brand-background text-white"><SelectValue /></SelectTrigger>
        <SelectContent className="border-brand-surface bg-brand-card text-white">
          {values.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
