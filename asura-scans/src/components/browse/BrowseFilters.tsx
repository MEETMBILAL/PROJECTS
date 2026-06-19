"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BrowseFiltersProps {
  genres: { id: string; name: string; slug: string }[];
}

const statuses = ["ONGOING", "COMPLETED", "HIATUS"];
const types = ["MANGA", "MANHWA", "MANHUA"];

export function BrowseFiltersBar({ genres }: BrowseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedGenres = searchParams.get("genres")?.split(",").filter(Boolean) ?? [];
  const selectedStatus = searchParams.get("status")?.split(",").filter(Boolean) ?? [];
  const selectedType = searchParams.get("type")?.split(",").filter(Boolean) ?? [];
  const sort = searchParams.get("sort") ?? "latest";

  const updateParams = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length) params.set(key, values.join(","));
    else params.delete(key);
    params.delete("page");
    router.push(`/browse?${params.toString()}`);
  };

  const toggleValue = (key: string, value: string, current: string[]) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams(key, next);
  };

  const activeChips: { key: string; value: string; label: string }[] = [
    ...selectedGenres.map((g) => ({
      key: "genres",
      value: g,
      label: genres.find((genre) => genre.slug === g)?.name ?? g,
    })),
    ...selectedStatus.map((s) => ({ key: "status", value: s, label: s })),
    ...selectedType.map((t) => ({ key: "type", value: t, label: t })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6 p-4 rounded-cover border border-brand-surface bg-brand-card">
        <div>
          <Label className="text-xs text-brand-secondary mb-2 block">Genre</Label>
          <div className="flex flex-wrap gap-2 max-w-xs">
            {genres.slice(0, 12).map((genre) => (
              <label
                key={genre.id}
                className="flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <Checkbox
                  checked={selectedGenres.includes(genre.slug)}
                  onCheckedChange={() =>
                    toggleValue("genres", genre.slug, selectedGenres)
                  }
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs text-brand-secondary mb-2 block">Status</Label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <label key={s} className="flex items-center gap-1.5 text-xs cursor-pointer">
                <Checkbox
                  checked={selectedStatus.includes(s)}
                  onCheckedChange={() => toggleValue("status", s, selectedStatus)}
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs text-brand-secondary mb-2 block">Type</Label>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <label key={t} className="flex items-center gap-1.5 text-xs cursor-pointer">
                <Checkbox
                  checked={selectedType.includes(t)}
                  onCheckedChange={() => toggleValue("type", t, selectedType)}
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs text-brand-secondary mb-2 block">Sort By</Label>
          <Select
            value={sort}
            onValueChange={(val) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("sort", val);
              params.delete("page");
              router.push(`/browse?${params.toString()}`);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="views">Views</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <Badge key={`${chip.key}-${chip.value}`} variant="outline" className="gap-1">
              {chip.label}
              <button
                onClick={() => {
                  const current =
                    chip.key === "genres"
                      ? selectedGenres
                      : chip.key === "status"
                        ? selectedStatus
                        : selectedType;
                  updateParams(
                    chip.key,
                    current.filter((v) => v !== chip.value)
                  );
                }}
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/browse")}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
