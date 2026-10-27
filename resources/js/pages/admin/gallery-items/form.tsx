import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    buttonPrimary,
    buttonSecondary,
    FormField,
    inputClass,
    PageHeader,
    textareaClass,
} from '@/components/admin/admin-ui';
import admin from '@/routes/admin';

type Category = { id: number; name: string };

type ItemDetail = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    file: string;
    type: string;
    alt: string | null;
    gallery_category_id: number | null;
    is_published: boolean;
    sort_order: number;
};

type Props = {
    item: ItemDetail | null;
    categories: Category[];
};

export default function GalleryItemForm({ item, categories }: Props) {
    const isEditing = item !== null;

    const form = useForm({
        title: item?.title ?? '',
        description: item?.description ?? '',
        file: null as File | null,
        type: item?.type ?? 'photo',
        alt: item?.alt ?? '',
        gallery_category_id:
            item?.gallery_category_id == null
                ? ''
                : String(item.gallery_category_id),
        is_published: item?.is_published ?? true,
        sort_order: item ? String(item.sort_order) : '0',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (item) {
            form.put(admin.galleryItems.update.url(item.id), {
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            form.post(admin.galleryItems.store.url(), {
                preserveScroll: true,
                forceFormData: true,
            });
        }
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Konten"
                title={isEditing ? item.title : 'Item galeri baru'}
                description="Tambahkan foto atau video dokumentasi."
                back={{
                    href: admin.galleryItems.index.url(),
                    label: 'Kembali ke daftar item',
                }}
                actions={
                    <>
                        <Link
                            href={admin.galleryItems.index.url()}
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
                                  : 'Simpan item'}
                        </button>
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr] xl:items-start">
                <div className="space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Informasi item</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="Judul"
                                htmlFor="title"
                                required
                                error={form.errors.title}
                            >
                                <input
                                    id="title"
                                    value={form.data.title}
                                    onChange={(e) =>
                                        form.setData('title', e.target.value)
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField
                                label="Tipe"
                                htmlFor="type"
                                required
                                error={form.errors.type}
                            >
                                <select
                                    id="type"
                                    value={form.data.type}
                                    onChange={(e) =>
                                        form.setData('type', e.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="photo">Foto</option>
                                    <option value="video">Video</option>
                                </select>
                            </FormField>

                            <FormField
                                label="File"
                                htmlFor="file"
                                error={form.errors.file}
                            >
                                <input
                                    id="file"
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) =>
                                        form.setData(
                                            'file',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            {isEditing && item && (
                                <p className="text-xs text-muted-foreground">
                                    File saat ini: {item.file}
                                </p>
                            )}

                            <FormField
                                label="Deskripsi"
                                htmlFor="description"
                                error={form.errors.description}
                            >
                                <textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    className={textareaClass}
                                    rows={4}
                                />
                            </FormField>

                            <FormField
                                label="Alt text"
                                htmlFor="alt"
                                error={form.errors.alt}
                            >
                                <input
                                    id="alt"
                                    value={form.data.alt}
                                    onChange={(e) =>
                                        form.setData('alt', e.target.value)
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Pengaturan</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="Kategori"
                                htmlFor="gallery_category_id"
                                error={form.errors.gallery_category_id}
                            >
                                <select
                                    id="gallery_category_id"
                                    value={form.data.gallery_category_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'gallery_category_id',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">Tanpa kategori</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
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
                                        form.setData(
                                            'sort_order',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_published}
                                    onChange={(e) =>
                                        form.setData(
                                            'is_published',
                                            e.target.checked,
                                        )
                                    }
                                    className="size-4 accent-primary"
                                />
                                Terbitkan
                            </label>
                        </div>
                    </section>
                </aside>
            </div>
        </form>
    );
}
