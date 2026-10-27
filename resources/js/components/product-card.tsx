import { Link } from '@inertiajs/react';
import { ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import QuoteButton from '@/components/quote-button';
import { cn } from '@/lib/utils';
import type { ProductCard as ProductCardType } from '@/types/catalog';

type ProductCardProps = {
    product: ProductCardType;
    className?: string;
};

const stockClass = (status: string): string => {
    if (status === 'Ready') {
        return 'text-success';
    }

    if (status === 'Habis') {
        return 'text-destructive';
    }

    return 'text-warning';
};

export default function ProductCard({ product, className }: ProductCardProps) {
    return (
        <article
            className={cn(
                'group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/35',
                className,
            )}
        >
            <Link
                href={product.url}
                className="relative block aspect-[4/3] overflow-hidden bg-secondary/70"
            >
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <span className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImageIcon className="size-7" aria-hidden="true" />
                        <span className="max-w-[80%] text-center text-xs font-medium">
                            {product.category ?? 'Alat kesehatan'}
                        </span>
                    </span>
                )}

                <span
                    className={cn(
                        'absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-sm bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm',
                        stockClass(product.stock_status),
                    )}
                >
                    <span
                        className="size-1.5 rounded-full bg-current"
                        aria-hidden="true"
                    />
                    {product.stock_label}
                </span>
                <span className="sr-only">Lihat detail {product.name}</span>
            </Link>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                    {product.brand ?? 'MGA Select'}
                </p>

                <h3 className="mt-2 text-base leading-snug font-bold tracking-tight">
                    <Link
                        href={product.url}
                        className="underline-offset-4 hover:underline"
                    >
                        {product.name}
                    </Link>
                </h3>

                {product.model && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Model {product.model}
                    </p>
                )}

                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div>
                        <p className="text-xs text-muted-foreground">Harga</p>
                        <p className="mt-1 text-sm font-extrabold tabular-nums">
                            {product.price ?? 'Hubungi kami'}
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <QuoteButton product={product} variant="compact" />
                        <Link
                            href={product.url}
                            className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-strong"
                            aria-label={`Lihat detail ${product.name}`}
                        >
                            <ArrowUpRight
                                className="size-4"
                                aria-hidden="true"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
