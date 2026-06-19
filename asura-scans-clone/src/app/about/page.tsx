import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container max-w-3xl space-y-4 py-10">
      <h1 className="text-2xl font-bold text-white">About {SITE.name}</h1>
      <p className="text-sm leading-relaxed text-brand-text-secondary">
        {SITE.name} is an open-source demonstration project: a full-stack manga, manhwa and manhua
        reading platform built with Next.js 14, Prisma and Tailwind CSS. It showcases a modern dark
        reading experience with bookmarks, ratings, search, a leaderboard and a customizable reader.
      </p>
      <p className="text-sm leading-relaxed text-brand-text-secondary">
        All comics, covers and chapter pages shown here are randomly generated placeholder content
        for demonstration purposes only. No copyrighted works are hosted or distributed.
      </p>
    </div>
  );
}
