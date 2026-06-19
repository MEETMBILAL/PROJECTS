"use client";

import { useReaderStore } from "@/stores/reader-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReaderSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BG_COLORS = [
  { value: "#000000", label: "Black" },
  { value: "#0F0F0F", label: "Dark Gray" },
  { value: "#1A1A1A", label: "Gray" },
  { value: "#FFFFFF", label: "White" },
];

export function ReaderSettings({ open, onOpenChange }: ReaderSettingsProps) {
  const {
    imageQuality,
    backgroundColor,
    readingMode,
    setImageQuality,
    setBackgroundColor,
    setReadingMode,
  } = useReaderStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reader Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-brand-text-secondary mb-2 block">Image Quality</label>
            <Select value={imageQuality} onValueChange={(v) => setImageQuality(v as typeof imageQuality)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-brand-text-secondary mb-2 block">Background Color</label>
            <Select value={backgroundColor} onValueChange={setBackgroundColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BG_COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-brand-text-secondary mb-2 block">Reading Mode</label>
            <Select value={readingMode} onValueChange={(v) => setReadingMode(v as typeof readingMode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="long-strip">Long Strip</SelectItem>
                <SelectItem value="paginated">Paginated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
