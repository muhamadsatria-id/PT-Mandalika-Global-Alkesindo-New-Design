import { Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { buttonPrimary, PageHeader } from '@/components/admin/admin-ui';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';
import type { SharedData } from '@/types';

type BrandRow = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    seo_title: string | null;
    seo_description: string | null;
    is_active: boolean;
    sort_order: number;
    products_count: number;
};

export default function BrandsIndex({ brands }: { brands: BrandRow[] }) {
    const { auth } = usePage<SharedData>().props;
    const canManage =
        auth.user?.permissions.includes('products.manage') ||
        auth.user?.permissions.includes('content.manage');

    const remove = (brand: BrandRow): void => {
        if (
            window.confirm(
                `Hapus brand "${brand.name}"? Tindakan ini tidak dapat dibatalkan.`,
            )
        ) {
            router.delete(admin.brands.destroy.url(brand.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <PageHeader
                eyebrow="Katalog"
                title="Brand"
                description="Kelola produsen dan merek alat kesehatan yang tersedia."
                actions={
                    <Link
                        href={admin.brands.create.url()}
                        className={buttonPrimary}
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Brand baru
                    </Link>
                }
            />

            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
                {brands.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <Tags
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm font-bold">
                            Belum ada brand
                        </p>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                            Tambahkan brand agar produk dapat dikelompokkan
                            berdasarkan produsen.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[40rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">
                                        Brand
                                    </th>
                                    <th className="px-3 py-3 text-center font-bold">
                                        Produk
                                    </th>
                                    <th className="px-3 py-3 text-center font-bold">
                                        Urutan
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
                                {brands.map((brand) => (
                                    <tr key={brand.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={admin.brands.edit.url(
                                                    brand.id,
                                                )}
                                                className="font-semibold hover:text-primary-strong"
                                            >
                                                {brand.name}
                                            </Link>
                                            <p className="mt-0.5 font-mono text-[0.68rem] text-muted-foreground">
                                                /{brand.slug}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3 text-center text-sm font-semibold tabular-nums">
                                            {brand.products_count}
                                        </td>
                                        <td className="px-3 py-3 text-center text-xs text-muted-foreground tabular-nums">
                                            {brand.sort_order}
                                        </td>
                                        <td className="px-3 py-3">
                                            <span
                                                className={cn(
                                                    'inline-flex rounded-full px-2 py-0.5 text-[0.62rem] font-bold',
                                                    brand.is_active
                                                        ? 'bg-success/10 text-success'
                                                        : 'bg-secondary text-muted-foreground',
                                                )}
                                            >
                                                {brand.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={admin.brands.edit.url(
                                                        brand.id,
                                                    )}
                                                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                    aria-label={`Edit ${brand.name}`}
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
                                                            remove(brand)
                                                        }
                                                        className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                                        aria-label={`Hapus ${brand.name}`}
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

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Brand yang masih dipakai produk tidak dapat dihapus. Pindahkan
                produk ke brand lain terlebih dahulu.
            </p>
        </>
    );
}
