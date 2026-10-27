import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Paginated } from '@/types/catalog';

type PaginationProps = {
    paginator: Pick<
        Paginated<unknown>,
        | 'current_page'
        | 'last_page'
        | 'from'
        | 'to'
        | 'total'
        | 'prev_page_url'
        | 'next_page_url'
    >;
    label?: string;
};

export default function Pagination({
    paginator,
    label = 'item',
}: PaginationProps) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <nav
            className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"
            aria-label="Navigasi halaman"
        >
            <p className="text-sm text-muted-foreground">
                Menampilkan {paginator.from ?? 0}–{paginator.to ?? 0} dari{' '}
                {paginator.total} {label}
            </p>

            <div className="flex items-center justify-between gap-2 sm:justify-end">
                {paginator.prev_page_url ? (
                    <Link
                        href={paginator.prev_page_url}
                        preserveScroll
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm font-semibold transition-colors hover:bg-secondary sm:px-3"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">
                            Sebelumnya
                        </span>
                    </Link>
                ) : (
                    <span className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border/50 px-2.5 text-sm font-semibold text-muted-foreground/50 sm:px-3">
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">
                            Sebelumnya
                        </span>
                    </span>
                )}

                <span className="min-w-16 text-center text-sm text-muted-foreground sm:min-w-20">
                    {paginator.current_page} / {paginator.last_page}
                </span>

                {paginator.next_page_url ? (
                    <Link
                        href={paginator.next_page_url}
                        preserveScroll
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm font-semibold transition-colors hover:bg-secondary sm:px-3"
                    >
                        <span className="sr-only sm:not-sr-only">
                            Berikutnya
                        </span>
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                ) : (
                    <span className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border/50 px-2.5 text-sm font-semibold text-muted-foreground/50 sm:px-3">
                        <span className="sr-only sm:not-sr-only">
                            Berikutnya
                        </span>
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                )}
            </div>
        </nav>
    );
}
