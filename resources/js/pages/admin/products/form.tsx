import { Link, useForm } from '@inertiajs/react';
import {
    FileText,
    Image as ImageIcon,
    Plus,
    Save,
    Star,
    Trash2,
} from 'lucide-react';
import type { FormEvent } from 'react';
import {
    buttonPrimary,
    buttonSecondary,
    FormField,
    inputClass,
    PageHeader,
    textareaClass,
} from '@/components/admin/admin-ui';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

type Option = {
    id: number;
    name: string;
};

type PriceModeOption = {
    value: string;
    label: string;
};

type SpecInput = {
    label: string;
    value: string;
};

type ExistingMedia = {
    id: number;
    url: string;
    alt: string | null;
    is_primary: boolean;
};

type ExistingDocument = {
    id: number;
    title: string;
    type: string;
    url: string;
};

type ProductDetail = {
    id: number;
    name: string;
    model: string | null;
    sku: string | null;
    slug: string;
    category_id: number;
    brand_id: number;
    short_description: string | null;
    description: string | null;
    price: number | null;
    price_mode: string;
    stock_status: string;
    is_featured: boolean;
    is_published: boolean;
    seo_title: string | null;
    seo_description: string | null;
    specs: Array<{ id: number; label: string | null; value: string }>;
    media: ExistingMedia[];
    documents: ExistingDocument[];
};

type ProductFormData = {
    category_id: string;
    brand_id: string;
    name: string;
    model: string;
    sku: string;
    short_description: string;
    description: string;
    price: string;
    price_mode: string;
    stock_status: string;
    is_featured: boolean;
    is_published: boolean;
    seo_title: string;
    seo_description: string;
    specs: SpecInput[];
    media: File[];
    documents: File[];
    removed_media: number[];
    removed_documents: number[];
    primary_media_id: number | null;
};

type ProductFormProps = {
    product: ProductDetail | null;
    categories: Option[];
    brands: Option[];
    priceModes: PriceModeOption[];
    stockStatuses: PriceModeOption[];
};

const emptySpecRows = (): SpecInput[] => [
    { label: '', value: '' },
    { label: '', value: '' },
    { label: '', value: '' },
    { label: '', value: '' },
];

export default function ProductForm({
    product,
    categories,
    brands,
    priceModes,
    stockStatuses,
}: ProductFormProps) {
    const isEditing = product !== null;

    const form = useForm<ProductFormData>({
        category_id: product ? String(product.category_id) : '',
        brand_id: product ? String(product.brand_id) : '',
        name: product?.name ?? '',
        model: product?.model ?? '',
        sku: product?.sku ?? '',
        short_description: product?.short_description ?? '',
        description: product?.description ?? '',
        price: product?.price === null ? '' : String(product?.price ?? ''),
        price_mode: product?.price_mode ?? 'contact',
        stock_status: product?.stock_status ?? 'Ready',
        is_featured: product?.is_featured ?? false,
        is_published: product?.is_published ?? false,
        seo_title: product?.seo_title ?? '',
        seo_description: product?.seo_description ?? '',
        specs:
            product?.specs.map((spec) => ({
                label: spec.label ?? '',
                value: spec.value,
            })) ?? emptySpecRows(),
        media: [],
        documents: [],
        removed_media: [],
        removed_documents: [],
        primary_media_id:
            product?.media.find((media) => media.is_primary)?.id ?? null,
    });

    const errors = form.errors as Record<string, string | undefined>;
    const existingMedia =
        product?.media.filter(
            (media) => !form.data.removed_media.includes(media.id),
        ) ?? [];
    const existingDocuments =
        product?.documents.filter(
            (document) => !form.data.removed_documents.includes(document.id),
        ) ?? [];
    const mediaCount = existingMedia.length + form.data.media.length;
    const documentCount = existingDocuments.length + form.data.documents.length;

    const updateSpec = (index: number, patch: Partial<SpecInput>): void => {
        form.setData(
            'specs',
            form.data.specs.map((spec, specIndex) =>
                specIndex === index ? { ...spec, ...patch } : spec,
            ),
        );
    };

    const addSpec = (): void => {
        if (form.data.specs.length >= 40) {
            return;
        }

        form.setData('specs', [...form.data.specs, { label: '', value: '' }]);
    };

    const removeSpec = (index: number): void => {
        form.setData(
            'specs',
            form.data.specs.filter((_, specIndex) => specIndex !== index),
        );
    };

    const toggleRemovedMedia = (id: number): void => {
        const removed = form.data.removed_media.includes(id);

        form.setData(
            'removed_media',
            removed
                ? form.data.removed_media.filter((item) => item !== id)
                : [...form.data.removed_media, id],
        );

        if (!removed && form.data.primary_media_id === id) {
            form.setData('primary_media_id', null);
        }
    };

    const toggleRemovedDocument = (id: number): void => {
        const removed = form.data.removed_documents.includes(id);

        form.setData(
            'removed_documents',
            removed
                ? form.data.removed_documents.filter((item) => item !== id)
                : [...form.data.removed_documents, id],
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (isEditing) {
            form.put(admin.products.update.url(product.id), {
                forceFormData: true,
                preserveScroll: true,
            });

            return;
        }

        form.post(admin.products.store.url(), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Katalog"
                title={isEditing ? product.name : 'Produk baru'}
                description={
                    isEditing
                        ? 'Perbarui informasi produk, media, dan pengaturan tampilannya.'
                        : 'Lengkapi data produk untuk menambahkannya ke katalog.'
                }
                back={{
                    href: admin.products.index.url(),
                    label: 'Kembali ke daftar produk',
                }}
                actions={
                    <>
                        <Link
                            href={admin.products.index.url()}
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
                                  : 'Simpan produk'}
                        </button>
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr] xl:items-start">
                <div className="space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Informasi dasar</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="Nama produk"
                                htmlFor="name"
                                required
                                error={errors.name}
                            >
                                <input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Contoh: Patient Monitor 12 Inci"
                                />
                            </FormField>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    label="Kategori"
                                    htmlFor="category_id"
                                    required
                                    error={errors.category_id}
                                >
                                    <select
                                        id="category_id"
                                        value={form.data.category_id}
                                        onChange={(event) =>
                                            form.setData(
                                                'category_id',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        <option value="">Pilih kategori</option>
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
                                    label="Brand"
                                    htmlFor="brand_id"
                                    required
                                    error={errors.brand_id}
                                >
                                    <select
                                        id="brand_id"
                                        value={form.data.brand_id}
                                        onChange={(event) =>
                                            form.setData(
                                                'brand_id',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        <option value="">Pilih brand</option>
                                        {brands.map((brand) => (
                                            <option
                                                key={brand.id}
                                                value={brand.id}
                                            >
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    label="Model"
                                    htmlFor="model"
                                    hint="Opsional, membantu pencarian."
                                    error={errors.model}
                                >
                                    <input
                                        id="model"
                                        value={form.data.model}
                                        onChange={(event) =>
                                            form.setData(
                                                'model',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                </FormField>

                                <FormField
                                    label="SKU"
                                    htmlFor="sku"
                                    hint="Harus unik antar produk."
                                    error={errors.sku}
                                >
                                    <input
                                        id="sku"
                                        value={form.data.sku}
                                        onChange={(event) =>
                                            form.setData(
                                                'sku',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="MGA-PM-001"
                                    />
                                </FormField>
                            </div>

                            <FormField
                                label="Deskripsi singkat"
                                htmlFor="short_description"
                                hint="Tampil di kartu produk dan ringkasan katalog."
                                error={errors.short_description}
                            >
                                <textarea
                                    id="short_description"
                                    rows={3}
                                    value={form.data.short_description}
                                    onChange={(event) =>
                                        form.setData(
                                            'short_description',
                                            event.target.value,
                                        )
                                    }
                                    className={textareaClass}
                                />
                            </FormField>

                            <FormField
                                label="Deskripsi lengkap"
                                htmlFor="description"
                                error={errors.description}
                            >
                                <textarea
                                    id="description"
                                    rows={8}
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
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-bold">
                                    Spesifikasi
                                </h2>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Baris dengan nilai kosong akan diabaikan.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addSpec}
                                disabled={form.data.specs.length >= 40}
                                className={buttonSecondary}
                            >
                                <Plus className="size-4" aria-hidden="true" />
                                Baris baru
                            </button>
                        </div>

                        <div className="mt-4 space-y-2">
                            {form.data.specs.map((spec, index) => (
                                <div
                                    key={index}
                                    className="grid gap-2 sm:grid-cols-[0.8fr_1.2fr_auto]"
                                >
                                    <div>
                                        <label
                                            htmlFor={`spec-label-${index}`}
                                            className="sr-only"
                                        >
                                            Label spesifikasi {index + 1}
                                        </label>
                                        <input
                                            id={`spec-label-${index}`}
                                            value={spec.label}
                                            onChange={(event) =>
                                                updateSpec(index, {
                                                    label: event.target.value,
                                                })
                                            }
                                            className={inputClass}
                                            placeholder="Label"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`spec-value-${index}`}
                                            className="sr-only"
                                        >
                                            Nilai spesifikasi {index + 1}
                                        </label>
                                        <input
                                            id={`spec-value-${index}`}
                                            value={spec.value}
                                            onChange={(event) =>
                                                updateSpec(index, {
                                                    value: event.target.value,
                                                })
                                            }
                                            className={inputClass}
                                            placeholder="Nilai"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSpec(index)}
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-border px-3 text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                        aria-label={`Hapus baris spesifikasi ${index + 1}`}
                                    >
                                        <Trash2
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </button>
                                    {(errors[`specs.${index}.label`] ??
                                        errors[`specs.${index}.value`]) && (
                                        <p className="text-xs font-medium text-destructive sm:col-span-3">
                                            {errors[`specs.${index}.label`] ??
                                                errors[`specs.${index}.value`]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Foto & dokumen</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Maksimal 5 foto (JPG/PNG/WebP, 4 MB) dan 5 PDF (5
                            MB). Foto pertama menjadi gambar utama bila belum
                            ditentukan.
                        </p>

                        {product && product.media.length > 0 && (
                            <div className="mt-5">
                                <p className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                    Foto tersimpan
                                </p>
                                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                                    {product.media.map((media) => {
                                        const removed =
                                            form.data.removed_media.includes(
                                                media.id,
                                            );

                                        return (
                                            <div
                                                key={media.id}
                                                className={cn(
                                                    'overflow-hidden rounded-md border border-border bg-background',
                                                    removed && 'opacity-45',
                                                )}
                                            >
                                                <img
                                                    src={media.url}
                                                    alt={media.alt ?? ''}
                                                    className="aspect-[4/3] w-full object-cover"
                                                />
                                                <div className="space-y-2 p-2.5">
                                                    <label className="flex items-center gap-2 text-xs font-medium">
                                                        <input
                                                            type="radio"
                                                            name="primary_media"
                                                            checked={
                                                                form.data
                                                                    .primary_media_id ===
                                                                media.id
                                                            }
                                                            onChange={() =>
                                                                form.setData(
                                                                    'primary_media_id',
                                                                    media.id,
                                                                )
                                                            }
                                                            disabled={removed}
                                                            className="size-3.5 accent-primary"
                                                        />
                                                        Foto utama
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleRemovedMedia(
                                                                media.id,
                                                            )
                                                        }
                                                        className={cn(
                                                            'text-[0.68rem] font-semibold',
                                                            removed
                                                                ? 'text-primary-strong hover:underline'
                                                                : 'text-destructive hover:underline',
                                                        )}
                                                    >
                                                        {removed
                                                            ? 'Batalkan hapus'
                                                            : 'Hapus foto'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <FormField
                                label="Tambah foto"
                                htmlFor="media"
                                hint={`${mediaCount} dari 5 foto`}
                                error={errors.media}
                            >
                                <input
                                    id="media"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={(event) =>
                                        form.setData(
                                            'media',
                                            Array.from(
                                                event.target.files ?? [],
                                            ),
                                        )
                                    }
                                    className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-foreground"
                                />
                                {form.data.media.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {form.data.media.map((file, index) => (
                                            <li
                                                key={`${file.name}-${index}`}
                                                className="flex items-center justify-between gap-2 text-xs"
                                            >
                                                <span className="truncate">
                                                    {file.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        form.setData(
                                                            'media',
                                                            form.data.media.filter(
                                                                (
                                                                    _,
                                                                    fileIndex,
                                                                ) =>
                                                                    fileIndex !==
                                                                    index,
                                                            ),
                                                        )
                                                    }
                                                    className="text-muted-foreground hover:text-destructive"
                                                    aria-label={`Hapus ${file.name}`}
                                                >
                                                    <Trash2
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </FormField>

                            <FormField
                                label="Tambah dokumen PDF"
                                htmlFor="documents"
                                hint={`${documentCount} dari 5 dokumen`}
                                error={errors.documents}
                            >
                                <input
                                    id="documents"
                                    type="file"
                                    accept="application/pdf"
                                    multiple
                                    onChange={(event) =>
                                        form.setData(
                                            'documents',
                                            Array.from(
                                                event.target.files ?? [],
                                            ),
                                        )
                                    }
                                    className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-foreground"
                                />
                                {form.data.documents.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {form.data.documents.map(
                                            (file, index) => (
                                                <li
                                                    key={`${file.name}-${index}`}
                                                    className="flex items-center justify-between gap-2 text-xs"
                                                >
                                                    <span className="truncate">
                                                        {file.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            form.setData(
                                                                'documents',
                                                                form.data.documents.filter(
                                                                    (
                                                                        _,
                                                                        fileIndex,
                                                                    ) =>
                                                                        fileIndex !==
                                                                        index,
                                                                ),
                                                            )
                                                        }
                                                        className="text-muted-foreground hover:text-destructive"
                                                        aria-label={`Hapus ${file.name}`}
                                                    >
                                                        <Trash2
                                                            className="size-3.5"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </FormField>
                        </div>

                        {product && product.documents.length > 0 && (
                            <div className="mt-5">
                                <p className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                    Dokumen tersimpan
                                </p>
                                <ul className="mt-2 space-y-2">
                                    {product.documents.map((document) => {
                                        const removed =
                                            form.data.removed_documents.includes(
                                                document.id,
                                            );

                                        return (
                                            <li
                                                key={document.id}
                                                className={cn(
                                                    'flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2',
                                                    removed && 'opacity-45',
                                                )}
                                            >
                                                <span className="flex min-w-0 items-center gap-2 text-xs">
                                                    <FileText
                                                        className="size-3.5 shrink-0 text-primary"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="truncate font-medium">
                                                        {document.title}
                                                    </span>
                                                    <span className="text-[0.6rem] text-muted-foreground uppercase">
                                                        {document.type}
                                                    </span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleRemovedDocument(
                                                            document.id,
                                                        )
                                                    }
                                                    className={cn(
                                                        'shrink-0 text-[0.68rem] font-semibold',
                                                        removed
                                                            ? 'text-primary-strong hover:underline'
                                                            : 'text-destructive hover:underline',
                                                    )}
                                                >
                                                    {removed
                                                        ? 'Batalkan'
                                                        : 'Hapus'}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </section>

                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">SEO</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="SEO title"
                                htmlFor="seo_title"
                                hint="Kosongkan untuk memakai nama produk."
                                error={errors.seo_title}
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
                                hint="Maksimal 500 karakter."
                                error={errors.seo_description}
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
                        <h2 className="text-sm font-bold">
                            Harga & ketersediaan
                        </h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="Mode harga"
                                htmlFor="price_mode"
                                required
                                error={errors.price_mode}
                            >
                                <select
                                    id="price_mode"
                                    value={form.data.price_mode}
                                    onChange={(event) =>
                                        form.setData(
                                            'price_mode',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    {priceModes.map((mode) => (
                                        <option
                                            key={mode.value}
                                            value={mode.value}
                                        >
                                            {mode.label}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            {form.data.price_mode === 'show' && (
                                <FormField
                                    label="Harga (Rupiah)"
                                    htmlFor="price"
                                    required
                                    hint="Angka tanpa titik atau koma."
                                    error={errors.price}
                                >
                                    <input
                                        id="price"
                                        type="number"
                                        min={0}
                                        inputMode="numeric"
                                        value={form.data.price}
                                        onChange={(event) =>
                                            form.setData(
                                                'price',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                </FormField>
                            )}

                            <FormField
                                label="Status stok"
                                htmlFor="stock_status"
                                required
                                error={errors.stock_status}
                            >
                                <select
                                    id="stock_status"
                                    value={form.data.stock_status}
                                    onChange={(event) =>
                                        form.setData(
                                            'stock_status',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    {stockStatuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        </div>
                    </section>

                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Publikasi</h2>
                        <div className="mt-4 space-y-4">
                            <label className="flex cursor-pointer items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_published}
                                    onChange={(event) =>
                                        form.setData(
                                            'is_published',
                                            event.target.checked,
                                        )
                                    }
                                    className="mt-0.5 size-4 accent-primary"
                                />
                                <span>
                                    <span className="block text-sm font-semibold">
                                        Terbitkan di katalog
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                        Produk dapat dilihat pengunjung dan
                                        mesin pencari.
                                    </span>
                                </span>
                            </label>

                            <label className="flex cursor-pointer items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_featured}
                                    onChange={(event) =>
                                        form.setData(
                                            'is_featured',
                                            event.target.checked,
                                        )
                                    }
                                    className="mt-0.5 size-4 accent-primary"
                                />
                                <span>
                                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                                        <Star
                                            className="size-3.5 text-primary"
                                            aria-hidden="true"
                                        />
                                        Produk unggulan
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                        Diprioritaskan di beranda.
                                    </span>
                                </span>
                            </label>
                        </div>
                    </section>

                    <div className="rounded-lg border border-border bg-secondary/40 p-4">
                        <div className="flex items-start gap-2.5">
                            <ImageIcon
                                className="mt-0.5 size-4 shrink-0 text-primary"
                                aria-hidden="true"
                            />
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                Simpan produk terlebih dahulu jika ingin melihat
                                hasilnya di katalog publik. Perubahan media
                                langsung diterapkan setelah disimpan.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    );
}
