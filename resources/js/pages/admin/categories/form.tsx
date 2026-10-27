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

type ParentOption = {
    id: number;
    name: string;
};

type CategoryDetail = {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    description: string | null;
    icon: string | null;
    seo_title: string | null;
    seo_description: string | null;
    is_active: boolean;
    sort_order: number;
};

type CategoryFormProps = {
    category: CategoryDetail | null;
    parents: ParentOption[];
};

export default function CategoryForm({ category, parents }: CategoryFormProps) {
    const isEditing = category !== null;

    const form = useForm({
        name: category?.name ?? '',
        parent_id:
            category?.parent_id === null
                ? ''
                : String(category?.parent_id ?? ''),
        description: category?.description ?? '',
        icon: category?.icon ?? '',
        seo_title: category?.seo_title ?? '',
        seo_description: category?.seo_description ?? '',
        is_active: category?.is_active ?? true,
        sort_order:
            category?.sort_order === undefined
                ? '0'
                : String(category.sort_order),
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (category) {
            form.put(admin.categories.update.url(category.id), {
                preserveScroll: true,
            });

            return;
        }

        form.post(admin.categories.store.url(), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Katalog"
                title={isEditing ? category.name : 'Kategori baru'}
                description={
                    isEditing
                        ? 'Perbarui nama, induk, dan pengaturan tampilan kategori.'
                        : 'Kelompokkan produk dengan nama yang jelas dan mudah dicari.'
                }
                back={{
                    href: admin.categories.index.url(),
                    label: 'Kembali ke daftar kategori',
                }}
                actions={
                    <>
                        <Link
                            href={admin.categories.index.url()}
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

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr] xl:items-start">
                <div className="space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Informasi dasar</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="Nama kategori"
                                htmlFor="name"
                                required
                                error={form.errors.name}
                            >
                                <input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Contoh: Monitoring Pasien"
                                />
                            </FormField>

                            {isEditing && (
                                <div>
                                    <p className="text-xs font-bold tracking-wide text-foreground">
                                        Slug
                                    </p>
                                    <p className="mt-1.5 rounded-md border border-border bg-secondary/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                                        /{category.slug}
                                    </p>
                                </div>
                            )}

                            <FormField
                                label="Kategori induk"
                                htmlFor="parent_id"
                                hint="Kosongkan bila ini kategori utama."
                                error={form.errors.parent_id}
                            >
                                <select
                                    id="parent_id"
                                    value={form.data.parent_id}
                                    onChange={(event) =>
                                        form.setData(
                                            'parent_id',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">
                                        Tanpa induk (kategori utama)
                                    </option>
                                    {parents.map((parent) => (
                                        <option
                                            key={parent.id}
                                            value={parent.id}
                                        >
                                            {parent.name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            <FormField
                                label="Deskripsi"
                                htmlFor="description"
                                error={form.errors.description}
                            >
                                <textarea
                                    id="description"
                                    rows={5}
                                    value={form.data.description}
                                    onChange={(event) =>
                                        form.setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    className={textareaClass}
                                />
                            </FormField>

                            <FormField
                                label="Nama ikon"
                                htmlFor="icon"
                                hint="Opsional. Gunakan nama ikon Lucide, misalnya activity."
                                error={form.errors.icon}
                            >
                                <input
                                    id="icon"
                                    value={form.data.icon}
                                    onChange={(event) =>
                                        form.setData('icon', event.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="activity"
                                />
                            </FormField>
                        </div>
                    </section>

                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">SEO</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="SEO title"
                                htmlFor="seo_title"
                                hint="Kosongkan untuk memakai nama kategori."
                                error={form.errors.seo_title}
                            >
                                <input
                                    id="seo_title"
                                    value={form.data.seo_title}
                                    onChange={(event) =>
                                        form.setData(
                                            'seo_title',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    maxLength={255}
                                />
                            </FormField>

                            <FormField
                                label="SEO description"
                                htmlFor="seo_description"
                                error={form.errors.seo_description}
                            >
                                <textarea
                                    id="seo_description"
                                    rows={3}
                                    value={form.data.seo_description}
                                    onChange={(event) =>
                                        form.setData(
                                            'seo_description',
                                            event.target.value,
                                        )
                                    }
                                    className={textareaClass}
                                    maxLength={500}
                                />
                            </FormField>
                        </div>
                    </section>
                </div>

                <aside className="space-y-6 xl:sticky xl:top-24">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Publikasi</h2>
                        <div className="mt-4 space-y-4">
                            <label className="flex cursor-pointer items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(event) =>
                                        form.setData(
                                            'is_active',
                                            event.target.checked,
                                        )
                                    }
                                    className="mt-0.5 size-4 accent-primary"
                                />
                                <span>
                                    <span className="block text-sm font-semibold">
                                        Tampilkan kategori
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                        Kategori aktif muncul di filter katalog
                                        dan navigasi publik.
                                    </span>
                                </span>
                            </label>

                            <FormField
                                label="Urutan tampil"
                                htmlFor="sort_order"
                                hint="Angka kecil tampil lebih dulu."
                                error={form.errors.sort_order}
                            >
                                <input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    max={9999}
                                    inputMode="numeric"
                                    value={form.data.sort_order}
                                    onChange={(event) =>
                                        form.setData(
                                            'sort_order',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                        </div>
                    </section>
                </aside>
            </div>
        </form>
    );
}
