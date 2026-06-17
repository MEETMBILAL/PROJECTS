import Link from "next/link";
import { SITE_NAME } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-surface lg:flex">
        <Link href={ROUTES.home} className="font-display text-3xl font-bold">
          {SITE_NAME}
        </Link>
        <div>
          <h2 className="font-display text-4xl leading-tight">
            Your next great read is one click away.
          </h2>
          <p className="mt-4 max-w-md text-surface/80">
            Join thousands of readers across Pakistan. Discover books, track
            orders, and print your own with Print-on-Demand.
          </p>
        </div>
        <p className="text-sm text-surface/60">
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
