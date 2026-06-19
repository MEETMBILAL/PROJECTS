"use client";

import * as React from "react";
import { create } from "zustand";
import { CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: Toast[];
  push: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: number) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, variant = "default") =>
    set((s) => ({
      toasts: [...s.toasts, { id: Date.now() + Math.random(), message, variant }],
    })),
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Imperative toast helper usable from anywhere on the client. */
export const toast = {
  show: (message: string) => useToastStore.getState().push(message, "default"),
  success: (message: string) => useToastStore.getState().push(message, "success"),
  error: (message: string) => useToastStore.getState().push(message, "error"),
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  React.useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(() => dismiss(t.id), 3200)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            "pointer-events-auto flex items-center gap-2.5 rounded-lg border border-brand-border bg-brand-card px-4 py-3 text-sm text-white shadow-nav animate-in slide-in-from-bottom-2",
            t.variant === "success" && "border-brand-new/40",
            t.variant === "error" && "border-brand-hot/40"
          )}
          onClick={() => dismiss(t.id)}
        >
          {t.variant === "success" && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-new" />
          )}
          {t.variant === "error" && (
            <XCircle className="h-4 w-4 shrink-0 text-brand-hot" />
          )}
          {t.variant === "default" && (
            <Info className="h-4 w-4 shrink-0 text-brand-purple-light" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
