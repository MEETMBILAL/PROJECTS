"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  BookMarked,
  Home,
  Compass,
  BookOpen,
  Trophy,
  Users,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { useUIStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bookmarks", label: "Bookmarks", icon: BookMarked },
  { href: "/browse", label: "Browse", icon: Compass },
];

const RESOURCES = [
  { href: "/browse?type=MANHWA", label: "Novels", icon: BookOpen },
  { href: "/browse?type=MANGA", label: "Comics", icon: BookOpen },
  { href: "/leaderboard", label: "Users / Leaderboard", icon: Trophy },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { openSearch, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useUIStore();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[60px] w-full border-b border-brand-surface bg-brand-nav/80 backdrop-blur-md transition-shadow duration-150",
        scrolled && "shadow-nav"
      )}
    >
      <nav className="container flex h-full items-center justify-between gap-4">
        {/* Left: logo + mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="rounded-md p-2 text-brand-text-secondary hover:bg-brand-card-hover hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-purple font-extrabold text-white">
              A
            </span>
            <span className="hidden text-lg font-bold text-white sm:inline">
              {SITE.name}
            </span>
          </Link>
        </div>

        {/* Center: nav links (desktop) */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  active
                    ? "text-brand-purple-light"
                    : "text-brand-text-secondary hover:bg-brand-card-hover hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: resources, search, user */}
        <div className="flex items-center gap-1">
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-brand-text-secondary transition-colors duration-150 hover:bg-brand-card-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple">
                  Resources
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {RESOURCES.map((r) => (
                  <DropdownMenuItem key={r.href} asChild>
                    <Link href={r.href}>
                      <r.icon className="h-4 w-4" />
                      {r.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="rounded-md p-2 text-brand-text-secondary transition-colors hover:bg-brand-card-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
          >
            <Search className="h-5 w-5" />
          </button>

          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-brand-card-hover" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple">
                  <Avatar>
                    {session.user.image && (
                      <AvatarImage src={session.user.image} alt={session.user.name ?? "User"} />
                    )}
                    <AvatarFallback>
                      {(session.user.name ?? session.user.email ?? "U")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[12rem]">
                <DropdownMenuLabel className="truncate text-sm text-white">
                  {session.user.name ?? session.user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/bookmarks">
                    <BookMarked className="h-4 w-4" />
                    My Bookmarks
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/leaderboard">
                    <Trophy className="h-4 w-4" />
                    Leaderboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="ml-1">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>

      <MobileDrawer />
    </header>
  );
}

function MobileDrawer() {
  const { mobileMenuOpen, closeMobileMenu } = useUIStore();
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!mobileMenuOpen) return null;

  const links = [...NAV_LINKS, ...RESOURCES];

  return (
    <div className="fixed inset-0 top-[60px] z-40 md:hidden">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeMobileMenu}
        aria-hidden
      />
      <div className="absolute left-0 top-0 h-[calc(100vh-60px)] w-72 animate-slide-in-right border-r border-brand-surface bg-brand-nav p-4">
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-card-hover text-brand-purple-light"
                    : "text-brand-text-secondary hover:bg-brand-card-hover hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
          <div className="my-2 h-px bg-brand-surface" />
          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-brand-text-secondary hover:bg-brand-card-hover hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-brand-text-secondary hover:bg-brand-card-hover hover:text-white"
            >
              <UserIcon className="h-5 w-5" />
              Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
