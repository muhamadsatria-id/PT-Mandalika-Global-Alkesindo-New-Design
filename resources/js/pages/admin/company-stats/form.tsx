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
    label: string;
    value: string;
    is_published: boolean;
    sort_order: number;
};

type Props = { stat: Row | null };

export default function CompanyStatForm({ stat }: Props) {
    const isEditing = stat !== null;
    const form = useForm({
        label: stat?.label ?? '',
        value: stat?.value ?? '',
        is_published: stat?.is_published ?? true,
        sort_order: stat ? String(stat.sort_order) : '0',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (stat) {
            form.put(admin.companyStats.update.url(stat.id), {
                preserveScroll: true,
            });
        } else {
            form.post(admin.companyStats.store.url(), { preserveScroll: true });
        }
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Konten"
                title={isEditing ? stat.label : 'Statistik baru'}
                description="Kelola angka ringkas beranda."
                back={{
                    href: admin.companyStats.index.url(),
                    label: 'Kembali ke daftar statistik',
                }}
                actions={
                    <>
                        <Link
                            href={admin.companyStats.index.url()}
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
                                  : 'Simpan statistik'}
                        </button>
                    </>
                }
            />
            <div className="mt-6 rounded-lg border border-border bg-card p-5">
                <div className="grid gap-4">
                    <FormField
                        label="Label"
                        htmlFor="label"
                        required
                        error={form.errors.label}
                    >
                        <input
                            id="label"
                            value={form.data.label}
                            onChange={(e) =>
                                form.setData('label', e.target.value)
                            }
                            className={inputClass}
                        />
                    </FormField>
                    <FormField
                        label="Nilai"
                        htmlFor="value"
                        required
                        error={form.errors.value}
                    >
                        <input
                            id="value"
                            value={form.data.value}
                            onChange={(e) =>
                                form.setData('value', e.target.value)
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
                            checked={form.data.is_published}
                            onChange={(e) =>
                                form.setData('is_published', e.target.checked)
                            }
                            className="size-4 accent-primary"
                        />
                        Terbitkan
                    </label>
                </div>
            </div>
        </form>
    );
}
