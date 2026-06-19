"use client";

import { create } from "zustand";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";
interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

/** Imperative helper usable anywhere on the client. */
export function toast(opts: { title: string; description?: string; variant?: ToastVariant }) {
  useToastStore.getState().push({
    title: opts.title,
    description: opts.description,
    variant: opts.variant ?? "default",
  });
}

const ICONS = {
  default: Info,
  success: CheckCircle2,
  error: AlertCircle,
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border border-brand-surface bg-brand-card p-4 shadow-nav animate-slide-in-right",
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 h-5 w-5 shrink-0",
                t.variant === "success" && "text-brand-new",
                t.variant === "error" && "text-brand-hot",
                t.variant === "default" && "text-brand-purple-light",
              )}
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-brand-text-secondary">{t.description}</p>
              )}
            </div>
            <button
              aria-label="Dismiss notification"
              onClick={() => dismiss(t.id)}
              className="text-brand-text-muted transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
