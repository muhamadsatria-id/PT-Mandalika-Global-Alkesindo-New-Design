import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { addQuoteItem } from '@/lib/quote';
import { cn } from '@/lib/utils';
import type { ProductCard as ProductCardType } from '@/types/catalog';

type QuoteButtonProps = {
    product: ProductCardType;
    variant?: 'solid' | 'outline' | 'compact';
    className?: string;
};

export default function QuoteButton({
    product,
    variant = 'solid',
    className,
}: QuoteButtonProps) {
    const [added, setAdded] = useState(false);

    const handleAdd = (): void => {
        addQuoteItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            model: product.model,
            price: product.price,
            url: product.url,
            image: product.image,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
    };

    if (variant === 'compact') {
        return (
            <button
                type="button"
                onClick={handleAdd}
                className={cn(
                    'inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-strong',
                    className,
                )}
                aria-label={`Tambah ${product.name} ke daftar penawaran`}
                title="Tambah ke daftar penawaran"
            >
                {added ? (
                    <Check className="size-4 text-success" aria-hidden="true" />
                ) : (
                    <Plus className="size-4" aria-hidden="true" />
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleAdd}
            className={cn(
                'inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors',
                variant === 'solid'
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'border border-border bg-background hover:bg-secondary',
                className,
            )}
            aria-live="polite"
        >
            {added ? (
                <>
                    <Check className="size-4 text-success" aria-hidden="true" />
                    Ditambahkan
                </>
            ) : (
                <>
                    <Plus className="size-4" aria-hidden="true" />
                    Tambah ke penawaran
                </>
            )}
        </button>
    );
}
