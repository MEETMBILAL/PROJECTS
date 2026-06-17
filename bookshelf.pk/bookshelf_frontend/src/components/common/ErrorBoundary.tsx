"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface-alt px-6 py-12 text-center">
            <AlertTriangle className="h-10 w-10 text-error" />
            <p className="font-display text-lg text-ink">
              Something went wrong
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="btn-outline"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
