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

type LegalDocumentDetail = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    file: string;
    type: string;
    issued_by: string | null;
    issued_at: string | null;
    is_published: boolean;
    sort_order: number;
};

type LegalDocumentFormProps = {
    document: LegalDocumentDetail | null;
};

export default function LegalDocumentForm({
    document,
}: LegalDocumentFormProps) {
    const isEditing = document !== null;

    const form = useForm({
        title: document?.title ?? '',
        description: document?.description ?? '',
        file: null as File | null,
        type: document?.type ?? 'sertifikat',
        issued_by: document?.issued_by ?? '',
        issued_at: document?.issued_at ?? '',
        is_published: document?.is_published ?? true,
        sort_order:
            document?.sort_order === undefined
                ? '0'
                : String(document.sort_order),
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (document) {
            form.put(admin.legalDocuments.update.url(document.id), {
                preserveScroll: true,
                forceFormData: true,
            });

            return;
        }

        form.post(admin.legalDocuments.store.url(), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Konten"
                title={isEditing ? document.title : 'Dokumen baru'}
                description={
                    isEditing
                        ? 'Perbarui dokumen legalitas perusahaan.'
                        : 'Tambahkan dokumen, sertifikat, atau legalitas baru.'
                }
                back={{
                    href: admin.legalDocuments.index.url(),
                    label: 'Kembali ke daftar dokumen',
                }}
                actions={
                    <>
                        <Link
                            href={admin.legalDocuments.index.url()}
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
                                  : 'Simpan dokumen'}
                        </button>
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr] xl:items-start">
                <div className="space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Informasi dokumen</h2>
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
                                    onChange={(event) =>
                                        form.setData(
                                            'title',
                                            event.target.value,
                                        )
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
                                    onChange={(event) =>
                                        form.setData('type', event.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="sertifikat">
                                        Sertifikat
                                    </option>
                                    <option value="izin_edar">Izin edar</option>
                                    <option value="nib">NIB</option>
                                    <option value="iso">ISO</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </FormField>

                            <FormField
                                label="Deskripsi"
                                htmlFor="description"
                                error={form.errors.description}
                            >
                                <textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(event) =>
                                        form.setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    className={textareaClass}
                                    rows={4}
                                />
                            </FormField>

                            <FormField
                                label="File dokumen"
                                htmlFor="file"
                                hint={
                                    isEditing
                                        ? 'Kosongkan jika tidak ingin mengganti file.'
                                        : undefined
                                }
                                error={form.errors.file}
                            >
                                <input
                                    id="file"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(event) =>
                                        form.setData(
                                            'file',
                                            event.target.files?.[0] ?? null,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            {isEditing && (
                                <p className="text-xs text-muted-foreground">
                                    File saat ini: {document.file}
                                </p>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Pengaturan</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="Penerbit"
                                htmlFor="issued_by"
                                error={form.errors.issued_by}
                            >
                                <input
                                    id="issued_by"
                                    value={form.data.issued_by}
                                    onChange={(event) =>
                                        form.setData(
                                            'issued_by',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField
                                label="Tanggal terbit"
                                htmlFor="issued_at"
                                error={form.errors.issued_at}
                            >
                                <input
                                    id="issued_at"
                                    type="date"
                                    value={form.data.issued_at}
                                    onChange={(event) =>
                                        form.setData(
                                            'issued_at',
                                            event.target.value,
                                        )
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
                                    onChange={(event) =>
                                        form.setData(
                                            'sort_order',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_published}
                                    onChange={(event) =>
                                        form.setData(
                                            'is_published',
                                            event.target.checked,
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
