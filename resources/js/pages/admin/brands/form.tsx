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

type BrandDetail = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    seo_title: string | null;
    seo_description: string | null;
    is_active: boolean;
    sort_order: number;
};

type BrandFormProps = {
    brand: BrandDetail | null;
};

export default function BrandForm({ brand }: BrandFormProps) {
    const isEditing = brand !== null;

    const form = useForm({
        name: brand?.name ?? '',
        logo: brand?.logo ?? '',
        description: brand?.description ?? '',
        seo_title: brand?.seo_title ?? '',
        seo_description: brand?.seo_description ?? '',
        is_active: brand?.is_active ?? true,
        sort_order:
            brand?.sort_order === undefined ? '0' : String(brand.sort_order),
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (brand) {
            form.put(admin.brands.update.url(brand.id), {
                preserveScroll: true,
            });

            return;
        }

        form.post(admin.brands.store.url(), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Katalog"
                title={isEditing ? brand.name : 'Brand baru'}
                description={
                    isEditing
                        ? 'Perbarui identitas dan pengaturan tampilan brand.'
                        : 'Tambahkan produsen atau merek alat kesehatan.'
                }
                back={{
                    href: admin.brands.index.url(),
                    label: 'Kembali ke daftar brand',
                }}
                actions={
                    <>
                        <Link
                            href={admin.brands.index.url()}
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
                                  : 'Simpan brand'}
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
                                label="Nama brand"
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
                                    placeholder="Contoh: Mindray"
                                />
                            </FormField>

                            {isEditing && (
                                <div>
                                    <p className="text-xs font-bold tracking-wide text-foreground">
                                        Slug
                                    </p>
                                    <p className="mt-1.5 rounded-md border border-border bg-secondary/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                                        /{brand.slug}
                                    </p>
                                </div>
                            )}

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
                        </div>
                    </section>

                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">SEO</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="SEO title"
                                htmlFor="seo_title"
                                hint="Kosongkan untuk memakai nama brand."
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
                        <h2 className="text-sm font-bold">Logo</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="URL atau path logo"
                                htmlFor="logo"
                                hint="Kosongkan bila belum tersedia. Gunakan path /storage/… atau URL penuh."
                                error={form.errors.logo}
                            >
                                <input
                                    id="logo"
                                    value={form.data.logo}
                                    onChange={(event) =>
                                        form.setData('logo', event.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="/storage/brands/mindray.png"
                                />
                            </FormField>

                            {form.data.logo && (
                                <div className="flex h-24 items-center justify-center rounded-md border border-border bg-secondary/40 p-3">
                                    <img
                                        src={form.data.logo}
                                        alt={`Pratinjau logo ${form.data.name || 'brand'}`}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

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
                                        Tampilkan brand
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                        Brand aktif muncul di filter katalog.
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
