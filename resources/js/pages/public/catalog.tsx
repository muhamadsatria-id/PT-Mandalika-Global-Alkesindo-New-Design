import { Link, router } from '@inertiajs/react';
import { PackageSearch, Search, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import Pagination from '@/components/pagination';
import ProductCard from '@/components/product-card';
import Seo from '@/components/seo';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import catalog from '@/routes/catalog';
import type {
    CatalogOption,
    Paginated,
    ProductCard as ProductCardType,
    SeoData,
} from '@/types/catalog';

type CatalogProps = {
    products: Paginated<ProductCardType>;
    filters: {
        q: string;
        kategori: string | null;
        brand: string | null;
        stok: string | null;
        urutkan: string;
    };
    categories: CatalogOption[];
    brands: CatalogOption[];
    stockOptions: Array<{ value: string; label: string }>;
    seo: SeoData;
};

type FilterState = CatalogProps['filters'];

const selectClass =
    'h-10 w-full min-w-0 rounded-md border border-border bg-background px-3 font-mono text-sm text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30';

export default function Catalog({
    products,
    filters,
    categories,
    brands,
    stockOptions,
    seo,
}: CatalogProps) {
    const [state, setState] = useState<FilterState>(filters);

    const apply = (overrides: Partial<FilterState>): void => {
        const next = { ...state, ...overrides };
        setState(next);

        router.get(
            catalog.index.url(),
            {
                q: next.q || undefined,
                kategori: next.kategori ?? undefined,
                brand: next.brand ?? undefined,
                stok: next.stok ?? undefined,
                urutkan: next.urutkan,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        apply({ q: state.q.trim() });
    };

    const queryFor = (overrides: Partial<FilterState>): string => {
        const next = { ...state, ...overrides };

        return catalog.index.url({
            query: {
                q: next.q || undefined,
                kategori: next.kategori ?? undefined,
                brand: next.brand ?? undefined,
                stok: next.stok ?? undefined,
                urutkan: next.urutkan,
            },
        });
    };

    const hasFilters = Boolean(
        state.q || state.kategori || state.brand || state.stok,
    );

    return (
        <>
            <Seo seo={seo} />

            <section className="border-b border-border bg-secondary/30">
                <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
                    <nav aria-label="Remah roti" className="font-mono text-xs">
                        <Link
                            href={home.url()}
                            className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                        >
                            Beranda
                        </Link>
                        <span
                            className="mx-2 text-muted-foreground/60"
                            aria-hidden="true"
                        >
                            /
                        </span>
                        <span className="font-semibold">Katalog</span>
                    </nav>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                            <h1 className="max-w-xl text-3xl leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-4xl">
                                Pilih alat, kami bantu sesuaikan.
                            </h1>
                            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                                Telusuri peralatan medis untuk rumah sakit,
                                klinik, dan fasilitas kesehatan. Tambahkan
                                beberapa produk lalu minta penawaran sekaligus.
                            </p>
                        </div>

                        <div className="flex items-baseline gap-2 border-t border-border pt-4 lg:border-t-0 lg:pt-0 lg:pb-1">
                            <span className="font-mono text-3xl font-extrabold tracking-tight tabular-nums">
                                {products.total}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                produk dalam katalog
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section
                aria-label="Filter produk"
                className="border-b border-border bg-card/60"
            >
                <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
                    <form
                        onSubmit={handleSubmit}
                        aria-label="Filter produk"
                        className="grid gap-3 lg:grid-cols-[1.7fr_1fr_1fr_1fr_auto]"
                    >
                        <div className="relative min-w-0">
                            <label htmlFor="q" className="sr-only">
                                Cari produk
                            </label>
                            <Search
                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <input
                                id="q"
                                type="search"
                                value={state.q}
                                onChange={(event) =>
                                    setState((current) => ({
                                        ...current,
                                        q: event.target.value,
                                    }))
                                }
                                placeholder="Cari nama, model, atau brand…"
                                className={cn(selectClass, 'pl-9')}
                            />
                        </div>

                        <div className="min-w-0">
                            <label htmlFor="kategori" className="sr-only">
                                Kategori
                            </label>
                            <select
                                id="kategori"
                                value={state.kategori ?? ''}
                                onChange={(event) =>
                                    apply({
                                        kategori: event.target.value || null,
                                    })
                                }
                                className={selectClass}
                            >
                                <option value="">Semua kategori</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.slug}
                                        value={category.slug}
                                    >
                                        {category.name} ({category.count})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="min-w-0">
                            <label htmlFor="brand" className="sr-only">
                                Brand
                            </label>
                            <select
                                id="brand"
                                value={state.brand ?? ''}
                                onChange={(event) =>
                                    apply({
                                        brand: event.target.value || null,
                                    })
                                }
                                className={selectClass}
                            >
                                <option value="">Semua brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.slug} value={brand.slug}>
                                        {brand.name} ({brand.count})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="min-w-0">
                            <label htmlFor="stok" className="sr-only">
                                Ketersediaan
                            </label>
                            <select
                                id="stok"
                                value={state.stok ?? ''}
                                onChange={(event) =>
                                    apply({
                                        stok: event.target.value || null,
                                    })
                                }
                                className={selectClass}
                            >
                                <option value="">Semua stok</option>
                                {stockOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Cari
                        </button>
                    </form>

                    {categories.length > 0 && (
                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border pt-4">
                            <span className="font-mono text-xs text-muted-foreground">
                                Kategori
                            </span>
                            <Link
                                href={queryFor({ kategori: null })}
                                className={cn(
                                    'border-b-2 py-1.5 font-mono text-xs transition-colors',
                                    state.kategori === null
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                                )}
                            >
                                Semua
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={queryFor({
                                        kategori: category.slug,
                                    })}
                                    className={cn(
                                        'border-b-2 py-1.5 font-mono text-xs transition-colors',
                                        state.kategori === category.slug
                                            ? 'border-primary text-foreground'
                                            : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                                    )}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p
                        className="text-sm text-muted-foreground"
                        aria-live="polite"
                    >
                        Menampilkan{' '}
                        <span className="font-mono text-foreground tabular-nums">
                            {products.from ?? 0}–{products.to ?? 0}
                        </span>{' '}
                        dari{' '}
                        <span className="font-mono text-foreground tabular-nums">
                            {products.total}
                        </span>{' '}
                        produk
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="urutkan"
                                className="text-xs text-muted-foreground"
                            >
                                Urutkan
                            </label>
                            <select
                                id="urutkan"
                                value={state.urutkan}
                                onChange={(event) =>
                                    apply({ urutkan: event.target.value })
                                }
                                className="h-8 rounded-md border border-border bg-background px-2 font-mono text-xs text-foreground transition-colors outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                            >
                                <option value="terbaru">Terbaru</option>
                                <option value="nama">Nama A–Z</option>
                                <option value="harga-rendah">
                                    Harga terendah
                                </option>
                                <option value="harga-tinggi">
                                    Harga tertinggi
                                </option>
                            </select>
                        </div>

                        {hasFilters && (
                            <Link
                                href={catalog.index.url()}
                                className="inline-flex items-center gap-1.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" aria-hidden="true" />
                                Reset filter
                            </Link>
                        )}
                    </div>
                </div>

                {products.data.length > 0 ? (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-16 text-center">
                        <PackageSearch
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <h2 className="mt-4 text-lg font-bold">
                            Produk tidak ditemukan
                        </h2>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                            Coba kata kunci lain, longgarkan filter, atau
                            hubungi kami untuk kebutuhan khusus.
                        </p>
                        <Link
                            href={catalog.index.url()}
                            className="mt-5 inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-semibold hover:bg-secondary"
                        >
                            Lihat semua produk
                        </Link>
                    </div>
                )}

                <Pagination paginator={products} label="produk" />
            </section>
        </>
    );
}
