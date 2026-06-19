"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Share2, Twitter, Facebook, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { useBookmarkStore } from "@/store/bookmarks";

interface ContinueButtonProps {
  slug: string;
  firstChapter: number;
}

export function ContinueButton({ slug, firstChapter }: ContinueButtonProps) {
  const { bookmarks } = useBookmarkStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lastRead = mounted ? bookmarks[slug]?.lastReadChapter ?? null : null;
  const target = lastRead ?? firstChapter;
  const label = lastRead ? `Continue Ch. ${lastRead}` : "Start Reading";

  return (
    <Button asChild size="lg">
      <Link href={`/comics/${slug}/chapter/${target}`}>
        <Play fill="currentColor" /> {label}
      </Link>
    </Button>
  );
}

export function ShareButtons({ title }: { title: string }) {
  const share = async (platform?: "twitter" | "facebook" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Reading ${title} on Asura Scans`)}&url=${encodeURIComponent(url)}`,
        "_blank",
      );
      return;
    }
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
      return;
    }
    try {
      if (navigator.share && !platform) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Share it with your friends!", variant: "success" });
    } catch {
      /* user cancelled share */
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="icon" aria-label="Share" onClick={() => share()}>
        <Share2 className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" aria-label="Share on Twitter" onClick={() => share("twitter")}>
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        aria-label="Share on Facebook"
        onClick={() => share("facebook")}
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" aria-label="Copy link" onClick={() => share("copy")}>
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
