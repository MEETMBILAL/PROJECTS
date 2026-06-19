import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="container flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-20 text-center">
      <h1 className="text-4xl font-black text-white">404</h1>
      <p className="text-brand-secondary">The chapter or comic you are looking for was not found.</p>
      <Button asChild><Link href="/browse">Browse comics</Link></Button>
    </main>
  );
}
