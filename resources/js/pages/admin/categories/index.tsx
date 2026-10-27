import { Link, router, usePage } from '@inertiajs/react';
import { FolderTree, Pencil, Plus, Trash2 } from 'lucide-react';
import { buttonPrimary, PageHeader } from '@/components/admin/admin-ui';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';
import type { SharedData } from '@/types';

type CategoryRow = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    parent_id: number | null;
    parent: string | null;
    seo_title: string | null;
    seo_description: string | null;
    is_active: boolean;
    sort_order: number;
    products_count: number;
};

export default function CategoriesIndex({
    categories,
}: {
    categories: CategoryRow[];
}) {
    const { auth } = usePage<SharedData>().props;
    const canManage =
        auth.user?.permissions.includes('products.manage') ||
        auth.user?.permissions.includes('content.manage');

    const remove = (category: CategoryRow): void => {
        if (
            window.confirm(
                `Hapus kategori "${category.name}"? Tindakan ini tidak dapat dibatalkan.`,
            )
        ) {
            router.delete(admin.categories.destroy.url(category.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <PageHeader
                eyebrow="Katalog"
                title="Kategori"
                description="Susun kelompok produk agar pengunjung lebih mudah menemukan alat yang dibutuhkan."
                actions={
                    <Link
                        href={admin.categories.create.url()}
                        className={buttonPrimary}
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Kategori baru
                    </Link>
                }
            />

            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <FolderTree
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm font-bold">
                            Belum ada kategori
                        </p>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                            Tambahkan kategori pertama sebelum mengisi produk.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[42rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">
                                        Kategori
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Induk
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
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={admin.categories.edit.url(
                                                    category.id,
                                                )}
                                                className="font-semibold hover:text-primary-strong"
                                            >
                                                {category.name}
                                            </Link>
                                            <p className="mt-0.5 font-mono text-[0.68rem] text-muted-foreground">
                                                /{category.slug}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3 text-xs text-muted-foreground">
                                            {category.parent ?? '—'}
                                        </td>
                                        <td className="px-3 py-3 text-center text-sm font-semibold tabular-nums">
                                            {category.products_count}
                                        </td>
                                        <td className="px-3 py-3 text-center text-xs text-muted-foreground tabular-nums">
                                            {category.sort_order}
                                        </td>
                                        <td className="px-3 py-3">
                                            <span
                                                className={cn(
                                                    'inline-flex rounded-full px-2 py-0.5 text-[0.62rem] font-bold',
                                                    category.is_active
                                                        ? 'bg-success/10 text-success'
                                                        : 'bg-secondary text-muted-foreground',
                                                )}
                                            >
                                                {category.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={admin.categories.edit.url(
                                                        category.id,
                                                    )}
                                                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                    aria-label={`Edit ${category.name}`}
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
                                                            remove(category)
                                                        }
                                                        className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                                        aria-label={`Hapus ${category.name}`}
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
                Kategori yang masih dipakai produk atau memiliki subkategori
                tidak dapat dihapus. Pindahkan produk terlebih dahulu.
            </p>
        </>
    );
}
