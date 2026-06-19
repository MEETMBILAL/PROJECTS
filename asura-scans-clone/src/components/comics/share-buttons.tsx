"use client";

import * as React from "react";
import { Twitter, Facebook, Link2, Check } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = React.useState(false);
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const iconClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-md border border-brand-surface text-brand-text-secondary transition-colors duration-150 hover:border-brand-purple hover:text-brand-purple-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple";

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className={iconClass}
      >
        <Twitter className="h-4 w-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={iconClass}
      >
        <Facebook className="h-4 w-4" />
      </a>
      <button onClick={copy} aria-label="Copy link" className={iconClass}>
        {copied ? <Check className="h-4 w-4 text-brand-new" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
