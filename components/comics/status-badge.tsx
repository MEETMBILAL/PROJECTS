import { Badge } from '@/components/ui/badge';
import type { ComicStatus } from '@/lib/types';
import { toTitleCase } from '@/lib/utils';

export function StatusBadge({ status }: { status: ComicStatus }) {
  const variant = status === 'COMPLETED' ? 'completed' : status === 'HIATUS' ? 'hot' : 'secondary';
  return <Badge variant={variant}>{toTitleCase(status)}</Badge>;
}
