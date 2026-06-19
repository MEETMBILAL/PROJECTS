import type { Metadata } from "next";

export const metadata: Metadata = { title: "DMCA" };

export default function DmcaPage() {
  return (
    <div className="container max-w-3xl space-y-4 py-10">
      <h1 className="text-2xl font-bold text-white">DMCA Notice</h1>
      <p className="text-sm leading-relaxed text-brand-text-secondary">
        This project is a technical demonstration and does not host or distribute any copyrighted
        works. All sample titles, covers and pages are randomly generated placeholders.
      </p>
      <p className="text-sm leading-relaxed text-brand-text-secondary">
        If you believe content displayed here infringes your rights, please open an issue on the
        project repository and the placeholder data will be updated.
      </p>
    </div>
  );
}
