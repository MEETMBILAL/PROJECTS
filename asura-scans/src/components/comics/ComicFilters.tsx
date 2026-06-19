"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface ComicFiltersProps {
  genres: Genre[];
  className?: string;
}

const STATUS_OPTIONS = [
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "HIATUS", label: "Hiatus" },
];

const TYPE_OPTIONS = [
  { value: "MANGA", label: "Manga" },
  { value: "MANHWA", label: "Manhwa" },
  { value: "MANHUA", label: "Manhua" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "az", label: "A-Z" },
  { value: "rating", label: "Rating" },
  { value: "views", label: "Views" },
];

export function ComicFiltersBar({ genres, className }: ComicFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get("genres")?.split(",").filter(Boolean) ?? []
  );
  const [selectedStatus, setSelectedStatus] = useState<string[]>(
    searchParams.get("status")?.split(",").filter(Boolean) ?? []
  );
  const [selectedType, setSelectedType] = useState<string[]>(
    searchParams.get("type")?.split(",").filter(Boolean) ?? []
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "latest");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedGenres.length) params.set("genres", selectedGenres.join(","));
    if (selectedStatus.length) params.set("status", selectedStatus.join(","));
    if (selectedType.length) params.set("type", selectedType.join(","));
    if (sort !== "latest") params.set("sort", sort);
    router.push(`/browse?${params.toString()}`);
  }, [selectedGenres, selectedStatus, selectedType, sort, router]);

  useEffect(() => {
    applyFilters();
  }, [selectedGenres, selectedStatus, selectedType, sort, applyFilters]);

  const toggleGenre = (slug: string) => {
    setSelectedGenres((prev) =>
      prev.includes(slug) ? prev.filter((g) => g !== slug) : [...prev, slug]
    );
  };

  const toggleStatus = (value: string) => {
    setSelectedStatus((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const toggleType = (value: string) => {
    setSelectedType((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const removeChip = (type: "genre" | "status" | "type", value: string) => {
    if (type === "genre") setSelectedGenres((prev) => prev.filter((g) => g !== value));
    if (type === "status") setSelectedStatus((prev) => prev.filter((s) => s !== value));
    if (type === "type") setSelectedType((prev) => prev.filter((t) => t !== value));
  };

  const activeChips = [
    ...selectedGenres.map((g) => ({
      type: "genre" as const,
      value: g,
      label: genres.find((genre) => genre.slug === g)?.name ?? g,
    })),
    ...selectedStatus.map((s) => ({
      type: "status" as const,
      value: s,
      label: STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s,
    })),
    ...selectedType.map((t) => ({
      type: "type" as const,
      value: t,
      label: TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t,
    })),
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-brand-card border border-brand-surface">
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-brand-text-muted mb-2 font-medium uppercase tracking-wide">Genre</p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {genres.map((genre) => (
              <label key={genre.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedGenres.includes(genre.slug)}
                  onCheckedChange={() => toggleGenre(genre.slug)}
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-brand-text-muted mb-2 font-medium uppercase tracking-wide">Status</p>
          <div className="space-y-2">
            {STATUS_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedStatus.includes(opt.value)}
                  onCheckedChange={() => toggleStatus(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-brand-text-muted mb-2 font-medium uppercase tracking-wide">Type</p>
          <div className="space-y-2">
            {TYPE_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedType.includes(opt.value)}
                  onCheckedChange={() => toggleType(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-brand-text-muted mb-2 font-medium uppercase tracking-wide">Sort By</p>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <Badge key={`${chip.type}-${chip.value}`} variant="outline" className="gap-1 pr-1">
              {chip.label}
              <button
                onClick={() => removeChip(chip.type, chip.value)}
                className="ml-1 hover:text-white"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedGenres([]);
              setSelectedStatus([]);
              setSelectedType([]);
              setSort("latest");
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
