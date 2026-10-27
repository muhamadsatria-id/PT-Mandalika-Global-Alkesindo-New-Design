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
    logo: string | null;
    url: string | null;
    is_active: boolean;
    sort_order: number;
};

type Props = { brand: Row | null };

export default function PartnerBrandForm({ brand }: Props) {
    const isEditing = brand !== null;
    const form = useForm({
        name: brand?.name ?? '',
        logo: null as File | null,
        url: brand?.url ?? '',
        is_active: brand?.is_active ?? true,
        sort_order: brand ? String(brand.sort_order) : '0',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (brand) {
            form.put(admin.partnerBrands.update.url(brand.id), {
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            form.post(admin.partnerBrands.store.url(), {
                preserveScroll: true,
                forceFormData: true,
            });
        }
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Konten"
                title={isEditing ? brand.name : 'Partner brand baru'}
                description="Kelola mitra principal."
                back={{
                    href: admin.partnerBrands.index.url(),
                    label: 'Kembali ke daftar brand',
                }}
                actions={
                    <>
                        <Link
                            href={admin.partnerBrands.index.url()}
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
                        label="Logo"
                        htmlFor="logo"
                        error={form.errors.logo}
                    >
                        <input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                form.setData(
                                    'logo',
                                    e.target.files?.[0] ?? null,
                                )
                            }
                            className={inputClass}
                        />
                    </FormField>
                    {isEditing && brand.logo && (
                        <p className="text-xs text-muted-foreground">
                            Logo saat ini: {brand.logo}
                        </p>
                    )}
                    <FormField
                        label="URL"
                        htmlFor="url"
                        error={form.errors.url}
                    >
                        <input
                            id="url"
                            value={form.data.url}
                            onChange={(e) =>
                                form.setData('url', e.target.value)
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
