"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface UploadedFile {
  name: string;
  url: string;
  pageEstimate: number;
}

interface PODUploaderProps {
  onFileReady: (file: UploadedFile | null) => void;
}

export function PODUploader({ onFileReady }: PODUploaderProps) {
  const [file, setFile] = useState<UploadedFile | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const selected = accepted[0];
      if (!selected) return;
      // For the demo flow we create a local object URL. A production build
      // would upload to Cloudinary using signed params from /pod/upload/.
      const url = URL.createObjectURL(selected);
      const pageEstimate = Math.max(
        1,
        Math.round(selected.size / 1024 / 40),
      );
      const uploaded: UploadedFile = {
        name: selected.name,
        url,
        pageEstimate,
      };
      setFile(uploaded);
      onFileReady(uploaded);
    },
    [onFileReady],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const clear = () => {
    setFile(null);
    onFileReady(null);
  };

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-alt p-4">
        <FileText className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <p className="font-medium text-ink">{file.name}</p>
          <p className="text-xs text-ink-secondary">
            Estimated {file.pageEstimate} pages
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          aria-label="Remove file"
          className="text-ink-muted hover:text-error"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition",
        isDragActive
          ? "border-primary bg-accent"
          : "border-border bg-surface-alt hover:border-primary",
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="h-10 w-10 text-primary" />
      <p className="font-medium text-ink">
        {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
      </p>
      <p className="text-sm text-ink-secondary">or click to browse (PDF only)</p>
    </div>
  );
}
