"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface PODUploaderProps {
  onFileSelected: (file: File | null) => void;
}

export function PODUploader({ onFileSelected }: PODUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (selected: File | null) => {
    setFile(selected);
    onFileSelected(selected);
  };

  return (
    <div>
      {file ? (
        <div className="flex items-center justify-between rounded-xl border border-bsborder bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
              <FileText size={20} />
            </span>
            <div>
              <p className="line-clamp-1 text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-muted">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleFile(null)}
            className="text-text-muted hover:text-error"
            aria-label="Remove file"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
            dragOver ? "border-primary bg-accent" : "border-bsborder bg-white",
          )}
        >
          <UploadCloud size={40} className="text-primary" strokeWidth={1.5} />
          <div>
            <p className="font-medium text-text-primary">
              Drag &amp; drop your PDF here
            </p>
            <p className="text-sm text-text-muted">or click to browse (PDF, max 50MB)</p>
          </div>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
