import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl space-y-4 py-10">
      <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
      <p className="text-sm leading-relaxed text-brand-text-secondary">
        This demonstration application stores only the data required to provide its features:
        your account email, hashed password (or OAuth profile), bookmarks, ratings and view history.
        We do not sell personal data. As a demo, do not store sensitive information in this app.
      </p>
      <p className="text-sm leading-relaxed text-brand-text-secondary">
        Authentication is handled by NextAuth.js. Passwords are hashed with bcrypt and never stored
        in plain text.
      </p>
    </div>
  );
}
