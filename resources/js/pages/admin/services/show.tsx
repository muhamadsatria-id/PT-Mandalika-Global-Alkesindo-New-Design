import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Download,
    ExternalLink,
    FileText,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Upload,
    Wrench,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import {
    buttonPrimary,
    buttonSecondary,
    FormField,
    inputClass,
    PageHeader,
    textareaClass,
} from '@/components/admin/admin-ui';
import StatusBadge from '@/components/admin/status-badge';
import { formatCurrency, formatDateTime } from '@/lib/format';
import admin from '@/routes/admin';
import type { SharedData } from '@/types';

type Option = {
    value: string;
    label: string;
};

type Technician = {
    id: number;
    name: string;
};

type Attachment = {
    id: number;
    name: string;
    type: string;
    is_image: boolean;
    is_video: boolean;
    url: string;
};

type TimelineEntry = {
    id: number;
    status: string;
    note: string | null;
    user: string | null;
    created_at: string | null;
};

type ServiceDetail = {
    id: number;
    code: string;
    status: string;
    equipment_name: string;
    brand: string | null;
    model: string | null;
    serial_number: string | null;
    issue: string;
    location: string | null;
    preference: string;
    preference_label: string;
    technician_id: number | null;
    technician: string | null;
    estimated_cost: number | null;
    scheduled_at: string | null;
    scheduled_at_local: string | null;
    completed_at: string | null;
    notes: string | null;
    created_at: string | null;
    updated_at: string | null;
    customer: {
        id: number;
        name: string;
        institution: string | null;
        city: string | null;
        phone: string;
        email: string | null;
    };
    timeline: TimelineEntry[];
    attachments: Attachment[];
};

type ServiceShowProps = {
    service: ServiceDetail;
    statuses: Option[];
    technicians: Technician[];
    whatsappUrl: string;
    receiptUrl: string;
};

type ManageForm = {
    status: string;
    technician_id: string;
    estimated_cost: string;
    scheduled_at: string;
    notes: string;
    status_note: string;
    attachments: File[];
    removed_attachments: number[];
};

function DetailItem({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div>
            <dt className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                {label}
            </dt>
            <dd className="mt-1 text-sm font-semibold">{children}</dd>
        </div>
    );
}

function ManageTicketForm({
    service,
    statuses,
    technicians,
}: {
    service: ServiceDetail;
    statuses: Option[];
    technicians: Technician[];
}) {
    const form = useForm<ManageForm>({
        status: service.status,
        technician_id:
            service.technician_id === null ? '' : String(service.technician_id),
        estimated_cost:
            service.estimated_cost === null
                ? ''
                : String(service.estimated_cost),
        scheduled_at: service.scheduled_at_local ?? '',
        notes: service.notes ?? '',
        status_note: '',
        attachments: [],
        removed_attachments: [],
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            technician_id: data.technician_id
                ? Number(data.technician_id)
                : null,
            estimated_cost:
                data.estimated_cost === '' ? null : Number(data.estimated_cost),
            scheduled_at: data.scheduled_at || null,
        }));

        form.put(admin.services.update.url(service.id), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit} className="mt-4 space-y-4">
            <FormField
                label="Status"
                htmlFor="status"
                required
                hint="Perubahan status akan dicatat di timeline."
                error={form.errors.status}
            >
                <select
                    id="status"
                    value={form.data.status}
                    onChange={(event) =>
                        form.setData('status', event.target.value)
                    }
                    className={inputClass}
                >
                    {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </FormField>

            <FormField
                label="Teknisi"
                htmlFor="technician_id"
                hint="Kosongkan bila belum ditugaskan."
                error={form.errors.technician_id}
            >
                <select
                    id="technician_id"
                    value={form.data.technician_id}
                    onChange={(event) =>
                        form.setData('technician_id', event.target.value)
                    }
                    className={inputClass}
                >
                    <option value="">Belum ditugaskan</option>
                    {technicians.map((technician) => (
                        <option key={technician.id} value={technician.id}>
                            {technician.name}
                        </option>
                    ))}
                </select>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
                <FormField
                    label="Estimasi (Rp)"
                    htmlFor="estimated_cost"
                    error={form.errors.estimated_cost}
                >
                    <input
                        id="estimated_cost"
                        type="number"
                        min={0}
                        step={1000}
                        inputMode="numeric"
                        value={form.data.estimated_cost}
                        onChange={(event) =>
                            form.setData('estimated_cost', event.target.value)
                        }
                        className={inputClass}
                    />
                </FormField>

                <FormField
                    label="Jadwal"
                    htmlFor="scheduled_at"
                    hint="Waktu WITA (Asia/Makassar)."
                    error={form.errors.scheduled_at}
                >
                    <input
                        id="scheduled_at"
                        type="datetime-local"
                        value={form.data.scheduled_at}
                        onChange={(event) =>
                            form.setData('scheduled_at', event.target.value)
                        }
                        className={inputClass}
                    />
                </FormField>
            </div>

            <FormField
                label="Catatan diagnosa"
                htmlFor="notes"
                hint="Terlihat oleh tim internal, tidak tampil di halaman publik."
                error={form.errors.notes}
            >
                <textarea
                    id="notes"
                    rows={4}
                    value={form.data.notes}
                    onChange={(event) =>
                        form.setData('notes', event.target.value)
                    }
                    className={textareaClass}
                    placeholder="Temuan teknisi, suku cadang, atau tindakan yang disarankan…"
                />
            </FormField>

            <FormField
                label="Catatan perubahan status"
                htmlFor="status_note"
                hint="Opsional. Disimpan di timeline saat status berubah."
                error={form.errors.status_note}
            >
                <textarea
                    id="status_note"
                    rows={2}
                    value={form.data.status_note}
                    onChange={(event) =>
                        form.setData('status_note', event.target.value)
                    }
                    className={textareaClass}
                    placeholder="Contoh: Menunggu konfirmasi biaya dari pelanggan."
                />
            </FormField>

            <FormField
                label="Tambah lampiran"
                htmlFor="attachments"
                hint="Foto, video, atau PDF. Maksimal 5 berkas, 10 MB per berkas."
                error={form.errors.attachments}
            >
                <label
                    htmlFor="attachments"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-secondary/30 px-3 py-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                    <Upload className="size-3.5" aria-hidden="true" />
                    Pilih berkas
                    <input
                        id="attachments"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm,application/pdf"
                        className="sr-only"
                        onChange={(event) => {
                            const files = Array.from(event.target.files ?? []);

                            if (files.length > 0) {
                                form.setData('attachments', [
                                    ...form.data.attachments,
                                    ...files,
                                ]);
                            }

                            event.target.value = '';
                        }}
                    />
                </label>
            </FormField>

            {form.data.attachments.length > 0 && (
                <ul className="space-y-1.5">
                    {form.data.attachments.map((file, index) => (
                        <li
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-2 rounded-md border border-border px-2.5 py-1.5 text-[0.68rem]"
                        >
                            <span className="truncate">{file.name}</span>
                            <button
                                type="button"
                                onClick={() =>
                                    form.setData(
                                        'attachments',
                                        form.data.attachments.filter(
                                            (_, fileIndex) =>
                                                fileIndex !== index,
                                        ),
                                    )
                                }
                                className="shrink-0 text-muted-foreground hover:text-destructive"
                            >
                                Hapus
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {service.attachments.length > 0 && (
                <fieldset className="min-w-0 rounded-md border border-border p-3">
                    <legend className="px-1 text-[0.68rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                        Lampiran tersimpan
                    </legend>
                    <p
                        id="removed-attachments-hint"
                        className="text-[0.68rem] leading-relaxed text-muted-foreground"
                    >
                        Centang berkas yang ingin dihapus. Perubahan berlaku
                        setelah disimpan.
                    </p>
                    <ul className="mt-2 space-y-1.5">
                        {service.attachments.map((attachment) => (
                            <li key={attachment.id}>
                                <label className="flex min-w-0 cursor-pointer items-center gap-2 text-[0.68rem]">
                                    <input
                                        type="checkbox"
                                        checked={form.data.removed_attachments.includes(
                                            attachment.id,
                                        )}
                                        onChange={(event) =>
                                            form.setData(
                                                'removed_attachments',
                                                event.target.checked
                                                    ? [
                                                          ...form.data
                                                              .removed_attachments,
                                                          attachment.id,
                                                      ]
                                                    : form.data.removed_attachments.filter(
                                                          (id) =>
                                                              id !==
                                                              attachment.id,
                                                      ),
                                            )
                                        }
                                        aria-describedby="removed-attachments-hint"
                                        className="size-3.5 shrink-0 accent-primary"
                                    />
                                    <span className="min-w-0 truncate">
                                        Hapus {attachment.name}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </fieldset>
            )}

            <button
                type="submit"
                disabled={form.processing}
                className={`${buttonPrimary} w-full`}
            >
                {form.processing ? 'Menyimpan…' : 'Simpan perubahan'}
            </button>

            <p className="text-[0.68rem] leading-relaxed text-muted-foreground">
                Setiap perubahan status menyimpan waktu dan nama pengguna yang
                memperbarui.
            </p>
        </form>
    );
}

export default function ServiceShow({
    service,
    statuses,
    technicians,
    whatsappUrl,
    receiptUrl,
}: ServiceShowProps) {
    const { auth } = usePage<SharedData>().props;
    const permissions = auth.user?.permissions ?? [];
    const canManage = permissions.includes('services.manage');
    const canViewCustomers =
        permissions.includes('customers.view') ||
        permissions.includes('customers.manage');

    return (
        <>
            <PageHeader
                eyebrow="Servis & perbaikan"
                title={service.code}
                description={`${service.equipment_name} · ${service.customer.name}`}
                back={{
                    href: admin.services.index.url(),
                    label: 'Kembali ke daftar servis',
                }}
                actions={
                    <>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-success/40 px-4 text-sm font-bold text-success transition-colors hover:bg-success/10"
                        >
                            <MessageCircle
                                className="size-4"
                                aria-hidden="true"
                            />
                            WhatsApp
                        </a>
                        <a href={receiptUrl} className={buttonSecondary}>
                            <Download className="size-4" aria-hidden="true" />
                            Tanda terima PDF
                        </a>
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr] xl:items-start">
                <div className="min-w-0 space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-sm font-bold">Pelanggan</h2>
                            {canViewCustomers && (
                                <Link
                                    href={admin.customers.show.url(
                                        service.customer.id,
                                    )}
                                    className="text-xs font-semibold text-primary-strong hover:underline"
                                >
                                    Lihat riwayat pelanggan
                                </Link>
                            )}
                        </div>

                        <div className="mt-3">
                            <p className="text-lg font-extrabold tracking-tight">
                                {service.customer.name}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {service.customer.institution ??
                                    'Instansi belum dicatat'}
                            </p>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <a
                                href={`tel:${service.customer.phone}`}
                                className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                            >
                                <Phone
                                    className="size-4 text-primary"
                                    aria-hidden="true"
                                />
                                <span className="tabular-nums">
                                    {service.customer.phone}
                                </span>
                            </a>
                            <span className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm">
                                <MapPin
                                    className="size-4 text-primary"
                                    aria-hidden="true"
                                />
                                {service.customer.city ?? '-'}
                            </span>
                            {service.customer.email && (
                                <a
                                    href={`mailto:${service.customer.email}`}
                                    className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary sm:col-span-2"
                                >
                                    <Mail
                                        className="size-4 text-primary"
                                        aria-hidden="true"
                                    />
                                    <span className="truncate">
                                        {service.customer.email}
                                    </span>
                                </a>
                            )}
                        </div>
                    </section>

                    <section className="rounded-lg border border-border bg-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-sm font-bold">Detail alat</h2>
                            <StatusBadge status={service.status} />
                        </div>

                        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                            <DetailItem label="Nama alat">
                                {service.equipment_name}
                            </DetailItem>
                            <DetailItem label="Brand / model">
                                {[service.brand, service.model]
                                    .filter(Boolean)
                                    .join(' · ') || '—'}
                            </DetailItem>
                            <DetailItem label="Nomor seri">
                                {service.serial_number ?? '—'}
                            </DetailItem>
                            <DetailItem label="Preferensi">
                                {service.preference_label}
                            </DetailItem>
                            <DetailItem label="Lokasi alat">
                                {service.location ?? '—'}
                            </DetailItem>
                            <DetailItem label="Diajukan">
                                {formatDateTime(service.created_at)}
                            </DetailItem>
                        </dl>

                        <div className="mt-5 border-t border-border pt-4">
                            <h3 className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                Keluhan
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line">
                                {service.issue}
                            </p>
                        </div>

                        <div className="mt-4 border-t border-border pt-4">
                            <h3 className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                Catatan diagnosa
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                                {service.notes ||
                                    'Belum ada catatan diagnosa dari teknisi.'}
                            </p>
                        </div>
                    </section>

                    <section className="rounded-lg border border-border bg-card">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                            <h2 className="text-sm font-bold">Lampiran</h2>
                            <span className="text-xs text-muted-foreground">
                                {service.attachments.length} berkas
                            </span>
                        </div>

                        <div className="p-5">
                            {service.attachments.length === 0 ? (
                                <div className="flex flex-col items-center py-6 text-center">
                                    <FileText
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                    <p className="mt-2 text-xs font-semibold text-muted-foreground">
                                        Belum ada foto, video, atau dokumen.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {service.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="overflow-hidden rounded-md border border-border"
                                        >
                                            {attachment.is_image ? (
                                                <a
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block bg-secondary/40"
                                                >
                                                    <img
                                                        src={attachment.url}
                                                        alt={`Lampiran ${attachment.name}`}
                                                        loading="lazy"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                </a>
                                            ) : attachment.is_video ? (
                                                <video
                                                    controls
                                                    preload="metadata"
                                                    className="h-40 w-full bg-black object-contain"
                                                >
                                                    <source
                                                        src={attachment.url}
                                                    />
                                                </video>
                                            ) : (
                                                <div className="flex h-40 items-center justify-center bg-secondary/40">
                                                    <FileText
                                                        className="size-8 text-muted-foreground"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
                                                <span className="min-w-0 truncate text-[0.68rem] font-semibold">
                                                    {attachment.name}
                                                </span>
                                                <a
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 text-[0.68rem] font-bold text-primary-strong hover:underline"
                                                >
                                                    Buka
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-lg border border-border bg-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-sm font-bold">
                                Timeline tiket
                            </h2>
                            <span className="text-xs text-muted-foreground">
                                {service.timeline.length} catatan
                            </span>
                        </div>

                        {service.timeline.length === 0 ? (
                            <p className="mt-3 text-sm text-muted-foreground">
                                Belum ada riwayat status.
                            </p>
                        ) : (
                            <ol className="mt-4 space-y-0">
                                {service.timeline.map((entry, index) => (
                                    <li
                                        key={entry.id}
                                        className="relative flex gap-3 pb-5 last:pb-0"
                                    >
                                        {index <
                                            service.timeline.length - 1 && (
                                            <span
                                                className="absolute top-5 left-[0.32rem] h-full w-px bg-border"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span
                                            className={
                                                index === 0
                                                    ? 'mt-1 size-2.5 shrink-0 rounded-full bg-primary ring-4 ring-primary/15'
                                                    : 'mt-1 size-2.5 shrink-0 rounded-full bg-border'
                                            }
                                            aria-hidden="true"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <StatusBadge
                                                    status={entry.status}
                                                />
                                                <span className="text-[0.68rem] text-muted-foreground">
                                                    {formatDateTime(
                                                        entry.created_at,
                                                    )}
                                                </span>
                                            </div>
                                            {entry.note && (
                                                <p className="mt-1.5 text-sm leading-relaxed">
                                                    {entry.note}
                                                </p>
                                            )}
                                            <p className="mt-1 text-[0.68rem] text-muted-foreground">
                                                oleh {entry.user ?? 'Sistem'}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </section>
                </div>

                <aside className="min-w-0 space-y-6 xl:sticky xl:top-24">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-bold">Status tiket</h2>
                            <StatusBadge status={service.status} />
                        </div>

                        <dl className="mt-4 space-y-2 border-b border-border pb-4 text-xs">
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Teknisi
                                </dt>
                                <dd className="text-right font-semibold">
                                    {service.technician ?? 'Belum ditugaskan'}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Estimasi
                                </dt>
                                <dd className="text-right font-semibold">
                                    {formatCurrency(service.estimated_cost) ??
                                        '—'}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Jadwal
                                </dt>
                                <dd className="text-right font-semibold">
                                    {service.scheduled_at
                                        ? formatDateTime(service.scheduled_at)
                                        : 'Belum dijadwalkan'}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Diperbarui
                                </dt>
                                <dd className="text-right font-semibold">
                                    {formatDateTime(service.updated_at)}
                                </dd>
                            </div>
                            {service.completed_at && (
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Selesai
                                    </dt>
                                    <dd className="text-right font-semibold">
                                        {formatDateTime(service.completed_at)}
                                    </dd>
                                </div>
                            )}
                        </dl>

                        {canManage ? (
                            <ManageTicketForm
                                key={[
                                    service.updated_at,
                                    service.status,
                                    service.technician_id,
                                    service.estimated_cost,
                                    service.scheduled_at,
                                    service.notes,
                                ].join('|')}
                                service={service}
                                statuses={statuses}
                                technicians={technicians}
                            />
                        ) : (
                            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                                Anda hanya dapat melihat tiket. Hubungi admin
                                atau teknisi untuk mengubah status, penugasan,
                                atau catatan.
                            </p>
                        )}
                    </section>

                    <div className="rounded-lg border border-border bg-secondary/40 p-4">
                        <div className="flex items-start gap-2.5">
                            <Wrench
                                className="mt-0.5 size-4 shrink-0 text-primary"
                                aria-hidden="true"
                            />
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                Gunakan WhatsApp untuk menyampaikan status dan
                                estimasi ke pelanggan. Simpan kesepakatan di
                                catatan diagnosa agar tim lain bisa melanjutkan.
                            </p>
                        </div>
                    </div>

                    <a
                        href={receiptUrl}
                        className={`${buttonSecondary} w-full`}
                    >
                        <Download className="size-4" aria-hidden="true" />
                        Unduh tanda terima
                    </a>

                    <Link
                        href={admin.services.index.url()}
                        className={`${buttonSecondary} w-full`}
                    >
                        Kembali ke daftar
                    </Link>

                    <p className="flex items-start gap-2 text-[0.68rem] leading-relaxed text-muted-foreground">
                        <ExternalLink
                            className="mt-0.5 size-3.5 shrink-0"
                            aria-hidden="true"
                        />
                        Tanda terima PDF memuat data tiket dan pelanggan.
                        Pastikan tidak dibagikan ke pihak yang tidak
                        berkepentingan.
                    </p>
                </aside>
            </div>
        </>
    );
}
