"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Menu,
  ChevronDown,
  Home,
  Bookmark,
  Compass,
  BookOpen,
  LogIn,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavbarStore, useSearchStore } from "@/stores";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/browse", label: "Browse", icon: Compass },
];

const resourceLinks = [
  { href: "/browse?type=MANHWA", label: "Novels" },
  { href: "/browse?type=MANGA", label: "Comics" },
  { href: "/leaderboard", label: "Users / Leaderboard" },
];

export function Navbar() {
  const { data: session } = useSession();
  const { scrolled, mobileOpen, setScrolled, setMobileOpen } = useNavbarStore();
  const { open: openSearch } = useSearchStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setScrolled]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[60px] border-b border-brand-surface bg-brand-nav/95 backdrop-blur-md transition-shadow duration-150",
        scrolled && "shadow-nav"
      )}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 lg:px-6" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-brand-purple">
            <Image
              src="/logo.svg"
              alt="Asura Scans logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <span className="hidden text-lg font-bold text-brand-text-primary sm:inline">
            Asura Scans
          </span>
        </Link>

        {/* Center nav - desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-4 py-2 text-sm font-medium text-brand-text-secondary transition-colors duration-150 hover:text-brand-text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Resources dropdown - desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hidden text-brand-text-secondary hover:text-brand-text-primary md:flex"
                aria-label="Resources menu"
              >
                Resources
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-brand-card border-brand-surface">
              {resourceLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={openSearch}
            aria-label="Open search"
            className="text-brand-text-secondary hover:text-brand-text-primary"
          >
            <Search className="h-5 w-5" />
          </Button>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User"} />
                    <AvatarFallback className="bg-brand-purple text-white">
                      {session.user.name?.[0] ?? session.user.email?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-brand-card border-brand-surface">
                <DropdownMenuItem asChild>
                  <Link href="/bookmarks">
                    <Bookmark className="mr-2 h-4 w-4" /> Bookmarks
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-brand-surface" />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden border-brand-purple text-brand-purple-light hover:bg-brand-purple/10 sm:flex"
            >
              <Link href="/login">
                <LogIn className="mr-1 h-4 w-4" /> Login
              </Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-brand-text-secondary"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-brand-card border-brand-surface">
              <SheetHeader>
                <SheetTitle className="text-brand-text-primary">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-brand-text-secondary hover:bg-brand-card-hover hover:text-brand-text-primary"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-brand-surface" />
                <p className="px-3 text-xs font-semibold uppercase text-brand-muted">Resources</p>
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-brand-text-secondary hover:bg-brand-card-hover"
                  >
                    <BookOpen className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                {!session?.user && (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-4 flex items-center justify-center gap-2 rounded-md bg-brand-purple px-4 py-2 text-white"
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
