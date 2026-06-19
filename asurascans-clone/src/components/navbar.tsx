"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BookMarked,
  ChevronDown,
  LogOut,
  Menu,
  Search as SearchIcon,
  User as UserIcon,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchModal } from "@/components/search-modal";
import { NAV_LINKS, RESOURCE_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K opens search
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-[60px] w-full border-b border-brand-border bg-brand-nav/90 backdrop-blur-md transition-shadow duration-150",
          scrolled && "shadow-nav"
        )}
      >
        <nav className="container flex h-full max-w-screen-2xl items-center justify-between gap-4">
          {/* Left: logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-purple text-sm font-black text-white">
                AS
              </span>
              <span className="hidden text-lg font-extrabold tracking-tight text-white sm:inline">
                {SITE.name}
              </span>
            </Link>

            {/* Center: nav links (desktop) */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "text-white"
                      : "text-brand-text-secondary hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: resources + search + user */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Resources <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Resources</DropdownMenuLabel>
                  {RESOURCE_LINKS.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
                    aria-label="Account menu"
                  >
                    <Avatar>
                      {session.user.image && (
                        <AvatarImage src={session.user.image} alt="" />
                      )}
                      <AvatarFallback>
                        {(session.user.name ?? "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {session.user.name ?? "Reader"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/bookmarks">
                      <BookMarked className="h-4 w-4" /> Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => signOut()}>
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/login">
                  <UserIcon className="h-4 w-4" /> Login
                </Link>
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile slide-in drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal>
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-[60px] h-[calc(100vh-60px)] w-72 animate-slide-in overflow-y-auto border-r border-brand-border bg-brand-nav p-4">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-brand-purple/15 text-brand-purple-light"
                      : "text-brand-text-secondary hover:bg-brand-card-hover hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-brand-border" />
              <p className="px-3 py-1 text-xs font-semibold uppercase text-brand-text-muted">
                Resources
              </p>
              {RESOURCE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-sm text-brand-text-secondary transition-colors hover:bg-brand-card-hover hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-brand-border" />
              {session?.user ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-brand-text-secondary hover:bg-brand-card-hover hover:text-white"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              ) : (
                <Button asChild className="mt-1 w-full">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
