"use client";

import { Component, type ReactNode } from "react";

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
          <div className="rounded-2xl border border-bsborder bg-white p-8 text-center">
            <h3 className="font-display text-xl text-text-primary">
              Something went wrong
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Please refresh the page and try again.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
