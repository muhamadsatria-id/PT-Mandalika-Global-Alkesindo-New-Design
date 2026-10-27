import { Link, router, usePage } from '@inertiajs/react';
import { Image as ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { buttonPrimary, PageHeader } from '@/components/admin/admin-ui';
import admin from '@/routes/admin';
import type { SharedData } from '@/types';

type Row = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    file: string;
    type: string;
    alt: string | null;
    category: string | null;
    category_id: number | null;
    is_published: boolean;
    sort_order: number;
};

export default function GalleryItemsIndex({ items }: { items: Row[] }) {
    const { auth } = usePage<SharedData>().props;
    const canManage =
        auth.user?.permissions.includes('content.manage') ?? false;

    const remove = (row: Row): void => {
        if (window.confirm(`Hapus item "${row.title}"?`)) {
            router.delete(admin.galleryItems.destroy.url(row.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <PageHeader
                eyebrow="Konten"
                title="Item galeri"
                description="Kelola foto dan video dokumentasi kegiatan."
                actions={
                    <Link
                        href={admin.galleryItems.create.url()}
                        className={buttonPrimary}
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Item baru
                    </Link>
                }
            />

            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <ImageIcon
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm font-bold">
                            Belum ada item galeri
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[52rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">
                                        Judul
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Tipe
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Kategori
                                    </th>
                                    <th className="px-3 py-3 text-center font-bold">
                                        Urutan
                                    </th>
                                    <th className="px-3 py-3 text-center font-bold">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-border/70 last:border-0"
                                    >
                                        <td className="px-4 py-3 font-semibold">
                                            {row.title}
                                        </td>
                                        <td className="px-3 py-3 font-mono text-xs">
                                            {row.type}
                                        </td>
                                        <td className="px-3 py-3 text-muted-foreground">
                                            {row.category ?? '-'}
                                        </td>
                                        <td className="px-3 py-3 text-center font-mono text-xs">
                                            {row.sort_order}
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            {row.is_published
                                                ? 'Terbit'
                                                : 'Draf'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={admin.galleryItems.edit.url(
                                                        row.id,
                                                    )}
                                                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
                                                            remove(row)
                                                        }
                                                        className="inline-flex size-8 items-center justify-center rounded-md border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
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
        </>
    );
}
