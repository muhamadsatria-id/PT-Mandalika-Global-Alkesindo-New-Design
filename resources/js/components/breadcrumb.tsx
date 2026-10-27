import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
    className?: string;
};

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
            <ol className="flex flex-wrap items-center gap-1.5">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-1.5">
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className={cn(
                                        isLast ? 'text-foreground' : 'text-muted-foreground',
                                    )}
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {item.label}
                                </span>
                            )}
                            {!isLast && (
                                <ChevronRight
                                    className="size-3.5 text-muted-foreground/60"
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
