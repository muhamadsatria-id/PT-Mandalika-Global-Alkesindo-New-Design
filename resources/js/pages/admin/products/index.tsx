import { Link, router, usePage } from '@inertiajs/react';
import { Package, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    buttonPrimary,
    buttonSecondary,
    inputClass,
    PageHeader,
    StatStrip,
} from '@/components/admin/admin-ui';
import Pagination from '@/components/pagination';
import { formatDate } from '@/lib/format';
import admin from '@/routes/admin';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import type { Paginated } from '@/types/catalog';

type Option = {
    id: number;
    name: string;
};

type AdminProduct = {
    id: number;
    name: string;
    model: string | null;
    sku: string | null;
    slug: string;
    category: string | null;
    brand: string | null;
    price: string | null;
    price_mode: string;
    stock_status: string;
    stock_label: string;
    is_published: boolean;
    is_featured: boolean;
    image: string | null;
    updated_at: string | null;
};

type ProductsIndexProps = {
    products: Paginated<AdminProduct>;
    filters: {
        q: string;
        status: string;
        kategori: number | null;
        brand: number | null;
    };
    categories: Option[];
    brands: Option[];
    stats: {
        total: number;
        published: number;
        draft: number;
    };
};

export default function ProductsIndex({
    products,
    filters,
    categories,
    brands,
    stats,
}: ProductsIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const canManage =
        auth.user?.permissions.includes('products.manage') ?? false;
    const [search, setSearch] = useState(filters.q);
    const [status, setStatus] = useState(filters.status);
    const [category, setCategory] = useState(
        filters.kategori === null ? '' : String(filters.kategori),
    );
    const [brand, setBrand] = useState(
        filters.brand === null ? '' : String(filters.brand),
    );

    const apply = (overrides: Record<string, string> = {}): void => {
        const next = {
            q: search,
            status,
            kategori: category,
            brand,
            ...overrides,
        };

        router.get(
            admin.products.index.url(),
            {
                q: next.q || undefined,
                status: next.status || undefined,
                kategori: next.kategori || undefined,
                brand: next.brand || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        apply();
    };

    const remove = (product: AdminProduct): void => {
        if (
            window.confirm(
                `Arsipkan produk "${product.name}"? Produk tidak akan tampil di katalog publik.`,
            )
        ) {
            router.delete(admin.products.destroy.url(product.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <PageHeader
                eyebrow="Katalog"
                title="Produk"
                description="Kelola etalase alat kesehatan, status terbit, harga, dan media produk."
                actions={
                    canManage ? (
                        <Link
                            href={admin.products.create.url()}
                            className={buttonPrimary}
                        >
                            <Plus className="size-4" aria-hidden="true" />
                            Produk baru
                        </Link>
                    ) : undefined
                }
            />

            <StatStrip
                items={[
                    { label: 'Total produk', value: stats.total },
                    {
                        label: 'Terbit',
                        value: stats.published,
                        hint: 'Tampil di katalog publik',
                    },
                    {
                        label: 'Draf',
                        value: stats.draft,
                        hint: 'Belum ditampilkan',
                    },
                ]}
            />

            <div className="mt-6 rounded-lg border border-border bg-card p-4">
                <form
                    onSubmit={submit}
                    className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
                >
                    <div className="relative">
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
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nama, model, atau SKU…"
                            className={cn(inputClass, 'pl-9')}
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="sr-only">
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(event) => {
                                setStatus(event.target.value);
                                apply({ status: event.target.value });
                            }}
                            className={inputClass}
                        >
                            <option value="">Semua status</option>
                            <option value="published">Terbit</option>
                            <option value="draft">Draf</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="kategori" className="sr-only">
                            Kategori
                        </label>
                        <select
                            id="kategori"
                            value={category}
                            onChange={(event) => {
                                setCategory(event.target.value);
                                apply({ kategori: event.target.value });
                            }}
                            className={inputClass}
                        >
                            <option value="">Semua kategori</option>
                            {categories.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="brand" className="sr-only">
                            Brand
                        </label>
                        <select
                            id="brand"
                            value={brand}
                            onChange={(event) => {
                                setBrand(event.target.value);
                                apply({ brand: event.target.value });
                            }}
                            className={inputClass}
                        >
                            <option value="">Semua brand</option>
                            {brands.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className={buttonSecondary}>
                        Cari
                    </button>
                </form>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
                {products.data.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <Package
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm font-bold">
                            Produk tidak ditemukan
                        </p>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                            Ubah kata kunci atau tambahkan produk pertama untuk
                            mulai mengisi katalog.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[52rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">
                                        Produk
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Kategori
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Harga
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Stok
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {products.data.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-secondary/50">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt=""
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package
                                                            className="size-4 text-muted-foreground"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <Link
                                                        href={admin.products.edit.url(
                                                            product.id,
                                                        )}
                                                        className="block truncate font-semibold hover:text-primary-strong"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                        {[
                                                            product.brand,
                                                            product.model,
                                                            product.sku,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' · ') ||
                                                            'Tanpa model'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-xs text-muted-foreground">
                                            {product.category ?? '—'}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            {product.price ?? 'Hubungi kami'}
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="text-xs font-semibold">
                                                {product.stock_label}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                <span
                                                    className={cn(
                                                        'rounded-full px-2 py-0.5 text-[0.62rem] font-bold',
                                                        product.is_published
                                                            ? 'bg-success/10 text-success'
                                                            : 'bg-secondary text-muted-foreground',
                                                    )}
                                                >
                                                    {product.is_published
                                                        ? 'Terbit'
                                                        : 'Draf'}
                                                </span>
                                                {product.is_featured && (
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.62rem] font-bold text-primary-strong">
                                                        Unggulan
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-[0.62rem] text-muted-foreground">
                                                {formatDate(product.updated_at)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={admin.products.edit.url(
                                                        product.id,
                                                    )}
                                                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                    aria-label={`Edit ${product.name}`}
                                                >
                                                    <Pencil
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                                {canManage && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            remove(product)
                                                        }
                                                        className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                                        aria-label={`Arsipkan ${product.name}`}
                                                    >
                                                        <Trash2
                                                            className="size-3.5"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Pagination paginator={products} label="produk" />
        </>
    );
}
