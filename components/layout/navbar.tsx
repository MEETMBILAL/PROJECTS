use client';

import { BookOpen, ChevronDown, Menu, Trophy, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SearchOverlay } from '@/components/comics/search-overlay';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/browse', label: 'Browse' },
];

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const accountButton = session?.user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus-purple rounded-full" aria-label="Open account menu">
          <Avatar><AvatarImage src={session.user.image ?? undefined} /><AvatarFallback>{session.user.name?.slice(0, 2).toUpperCase() ?? 'AS'}</AvatarFallback></Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button size="sm" onClick={() => signIn()} aria-label="Log in">Login</Button>
  );

  return (
    <header className={cn('fixed inset-x-0 top-0 z-40 h-[60px] border-b border-brand-surface bg-brand-nav/95 backdrop-blur transition-shadow duration-150', scrolled && 'shadow-lg shadow-black/40')}>
      <nav className="container flex h-full items-center justify-between gap-4" aria-label="Primary navigation">
        <Link href="/" className="focus-purple flex items-center gap-2 rounded-md">
          <Image src="/asura-logo.svg" alt="Asura Scans logo" width={34} height={34} priority />
          <span className="text-lg font-black tracking-tight text-white">Asura Scans</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => <Link key={link.href} href={link.href} className="focus-purple rounded-md text-sm font-semibold text-brand-secondary transition-colors hover:text-white">{link.label}</Link>)}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="gap-1">Resources <ChevronDown className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href="/browse?type=MANHWA"><BookOpen className="mr-2 h-4 w-4" /> Novels</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/browse"><BookOpen className="mr-2 h-4 w-4" /> Comics</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/leaderboard"><Trophy className="mr-2 h-4 w-4" /> Users / Leaderboard</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SearchOverlay />
          {accountButton}
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <SearchOverlay />
          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Open mobile menu"><Menu className="h-5 w-5" /></Button></DialogTrigger>
            <DialogContent className="left-auto right-0 top-0 h-full w-80 max-w-[90vw] translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 p-0">
              <DialogTitle className="sr-only">Mobile navigation</DialogTitle>
              <div className="flex h-[60px] items-center justify-between border-b border-brand-surface px-4">
                <span className="font-bold">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close mobile menu"><X className="h-5 w-5" /></Button>
              </div>
              <div className="grid gap-2 p-4">
                {[...navLinks, { href: '/leaderboard', label: 'Leaderboard' }].map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="focus-purple rounded-lg px-3 py-3 text-brand-secondary hover:bg-brand-cardHover hover:text-white">{link.label}</Link>)}
                <Button onClick={() => signIn()} className="mt-4"><Users className="h-4 w-4" /> Login / Account</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </header>
  );
}
