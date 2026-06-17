"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface PODUploaderProps {
  fileName: string | null;
  onFileSelected: (file: File) => void;
  onClear: () => void;
}

export function PODUploader({ fileName, onFileSelected, onClear }: PODUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFileSelected(file);
  };

  if (fileName) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-bsborder bg-surface-alt p-4">
        <div className="flex items-center gap-3">
          <FileText className="text-primary" size={24} />
          <span className="text-sm text-text-primary">{fileName}</span>
        </div>
        <button type="button" onClick={onClear} aria-label="Remove file">
          <X size={18} className="text-text-muted hover:text-error" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition",
        dragging ? "border-primary bg-accent" : "border-bsborder bg-surface-alt",
      )}
    >
      <UploadCloud size={40} className="text-text-muted" />
      <p className="font-medium text-text-primary">
        Drag &amp; drop your PDF here, or click to browse
      </p>
      <p className="text-sm text-text-muted">PDF up to 100MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
