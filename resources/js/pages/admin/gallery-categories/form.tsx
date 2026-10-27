import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    buttonPrimary,
    buttonSecondary,
    FormField,
    inputClass,
    PageHeader,
} from '@/components/admin/admin-ui';
import admin from '@/routes/admin';

type Row = {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
    is_active: boolean;
};

type Props = { category: Row | null };

export default function GalleryCategoryForm({ category }: Props) {
    const isEditing = category !== null;
    const form = useForm({
        name: category?.name ?? '',
        sort_order: category ? String(category.sort_order) : '0',
        is_active: category?.is_active ?? true,
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (category) {
            form.put(admin.galleryCategories.update.url(category.id), {
                preserveScroll: true,
            });
        } else {
            form.post(admin.galleryCategories.store.url(), {
                preserveScroll: true,
            });
        }
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Konten"
                title={isEditing ? category.name : 'Kategori galeri baru'}
                description="Kelola kategori dokumentasi."
                back={{
                    href: admin.galleryCategories.index.url(),
                    label: 'Kembali ke daftar kategori',
                }}
                actions={
                    <>
                        <Link
                            href={admin.galleryCategories.index.url()}
                            className={buttonSecondary}
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className={buttonPrimary}
                        >
                            <Save className="size-4" aria-hidden="true" />
                            {form.processing
                                ? 'Menyimpan…'
                                : isEditing
                                  ? 'Simpan perubahan'
                                  : 'Simpan kategori'}
                        </button>
                    </>
                }
            />
            <div className="mt-6 rounded-lg border border-border bg-card p-5">
                <div className="grid gap-4">
                    <FormField
                        label="Nama"
                        htmlFor="name"
                        required
                        error={form.errors.name}
                    >
                        <input
                            id="name"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            className={inputClass}
                        />
                    </FormField>
                    <FormField
                        label="Urutan"
                        htmlFor="sort_order"
                        error={form.errors.sort_order}
                    >
                        <input
                            id="sort_order"
                            type="number"
                            value={form.data.sort_order}
                            onChange={(e) =>
                                form.setData('sort_order', e.target.value)
                            }
                            className={inputClass}
                        />
                    </FormField>
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(e) =>
                                form.setData('is_active', e.target.checked)
                            }
                            className="size-4 accent-primary"
                        />
                        Aktif
                    </label>
                </div>
            </div>
        </form>
    );
}
