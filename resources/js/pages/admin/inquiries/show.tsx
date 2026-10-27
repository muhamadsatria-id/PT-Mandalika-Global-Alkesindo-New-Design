import { Link, useForm, usePage } from '@inertiajs/react';
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { FormEvent } from 'react';
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

type StatusOption = {
    value: string;
    label: string;
};

type SalesUser = {
    id: number;
    name: string;
};

type InquiryItem = {
    id: number;
    product_id: number | null;
    name: string;
    brand: string | null;
    qty: number;
    price: number | null;
};

type InquiryDetail = {
    id: number;
    code: string;
    status: string;
    notes: string | null;
    deal_value: number | null;
    assigned_to: number | null;
    closed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    source: {
        utm_source: string | null;
        utm_medium: string | null;
        utm_campaign: string | null;
        utm_term: string | null;
        utm_content: string | null;
        referrer: string | null;
        landing_url: string | null;
    };
    customer: {
        id: number;
        name: string;
        institution: string;
        city: string;
        phone: string;
        email: string | null;
    };
    items: InquiryItem[];
    assignee: string | null;
};

type InquiryShowProps = {
    inquiry: InquiryDetail;
    statuses: StatusOption[];
    salesUsers: SalesUser[];
    whatsappUrl: string;
};

export default function InquiryShow({
    inquiry,
    statuses,
    salesUsers,
    whatsappUrl,
}: InquiryShowProps) {
    const { auth } = usePage<SharedData>().props;
    const permissions = auth.user?.permissions ?? [];
    const canManage = permissions.includes('inquiries.manage');
    const canViewCustomers =
        permissions.includes('customers.view') ||
        permissions.includes('customers.manage');

    const form = useForm({
        status: inquiry.status,
        assigned_to:
            inquiry.assigned_to === null ? '' : String(inquiry.assigned_to),
        deal_value:
            inquiry.deal_value === null ? '' : String(inquiry.deal_value),
        notes: inquiry.notes ?? '',
    });

    const total = inquiry.items.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.qty,
        0,
    );
    const hasSource = Object.values(inquiry.source).some(Boolean);

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.put(admin.inquiries.update.url(inquiry.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <PageHeader
                eyebrow="Lead & penawaran"
                title={inquiry.code}
                description={`Masuk ${formatDateTime(inquiry.created_at)} · ${inquiry.customer.institution}`}
                back={{
                    href: admin.inquiries.index.url(),
                    label: 'Kembali ke daftar lead',
                }}
                actions={
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-success/40 px-4 text-sm font-bold text-success transition-colors hover:bg-success/10"
                    >
                        <MessageCircle className="size-4" aria-hidden="true" />
                        Balas via WhatsApp
                    </a>
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
                                        inquiry.customer.id,
                                    )}
                                    className="text-xs font-semibold text-primary-strong hover:underline"
                                >
                                    Lihat riwayat pelanggan
                                </Link>
                            )}
                        </div>

                        <div className="mt-3">
                            <p className="text-lg font-extrabold tracking-tight">
                                {inquiry.customer.name}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {inquiry.customer.institution}
                            </p>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <a
                                href={`tel:${inquiry.customer.phone}`}
                                className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                            >
                                <Phone
                                    className="size-4 text-primary"
                                    aria-hidden="true"
                                />
                                <span className="tabular-nums">
                                    {inquiry.customer.phone}
                                </span>
                            </a>
                            <span className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm">
                                <MapPin
                                    className="size-4 text-primary"
                                    aria-hidden="true"
                                />
                                {inquiry.customer.city}
                            </span>
                            {inquiry.customer.email && (
                                <a
                                    href={`mailto:${inquiry.customer.email}`}
                                    className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary sm:col-span-2"
                                >
                                    <Mail
                                        className="size-4 text-primary"
                                        aria-hidden="true"
                                    />
                                    <span className="truncate">
                                        {inquiry.customer.email}
                                    </span>
                                </a>
                            )}
                        </div>
                    </section>

                    <section className="rounded-lg border border-border bg-card">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                            <h2 className="text-sm font-bold">
                                Item permintaan
                            </h2>
                            <span className="text-xs text-muted-foreground">
                                {inquiry.items.length} produk
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[34rem] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                        <th className="px-5 py-2.5 font-bold">
                                            Produk
                                        </th>
                                        <th className="px-3 py-2.5 text-right font-bold">
                                            Qty
                                        </th>
                                        <th className="px-3 py-2.5 text-right font-bold">
                                            Harga saat diminta
                                        </th>
                                        <th className="px-5 py-2.5 text-right font-bold">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {inquiry.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-5 py-3">
                                                <p className="font-semibold">
                                                    {item.name}
                                                </p>
                                                {item.brand && (
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {item.brand}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 text-right font-semibold tabular-nums">
                                                {item.qty}
                                            </td>
                                            <td className="px-3 py-3 text-right text-xs whitespace-nowrap">
                                                {formatCurrency(item.price) ?? (
                                                    <span className="text-muted-foreground">
                                                        Hubungi kami
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-right text-xs font-semibold whitespace-nowrap">
                                                {item.price === null
                                                    ? '—'
                                                    : formatCurrency(
                                                          item.price * item.qty,
                                                      )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t border-border bg-secondary/40">
                                        <td
                                            colSpan={3}
                                            className="px-5 py-3 text-right text-xs font-bold tracking-wide text-muted-foreground uppercase"
                                        >
                                            Perkiraan total
                                        </td>
                                        <td className="px-5 py-3 text-right text-sm font-extrabold whitespace-nowrap">
                                            {formatCurrency(total) ?? '—'}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    {hasSource && (
                        <section className="rounded-lg border border-border bg-card p-5">
                            <h2 className="text-sm font-bold">
                                Sumber kunjungan
                            </h2>
                            <dl className="mt-3 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
                                {inquiry.source.utm_source && (
                                    <div>
                                        <dt className="text-muted-foreground">
                                            UTM source
                                        </dt>
                                        <dd className="font-semibold">
                                            {inquiry.source.utm_source}
                                        </dd>
                                    </div>
                                )}
                                {inquiry.source.utm_medium && (
                                    <div>
                                        <dt className="text-muted-foreground">
                                            UTM medium
                                        </dt>
                                        <dd className="font-semibold">
                                            {inquiry.source.utm_medium}
                                        </dd>
                                    </div>
                                )}
                                {inquiry.source.utm_campaign && (
                                    <div>
                                        <dt className="text-muted-foreground">
                                            UTM campaign
                                        </dt>
                                        <dd className="font-semibold">
                                            {inquiry.source.utm_campaign}
                                        </dd>
                                    </div>
                                )}
                                {inquiry.source.utm_term && (
                                    <div>
                                        <dt className="text-muted-foreground">
                                            UTM term
                                        </dt>
                                        <dd className="font-semibold">
                                            {inquiry.source.utm_term}
                                        </dd>
                                    </div>
                                )}
                                {inquiry.source.utm_content && (
                                    <div>
                                        <dt className="text-muted-foreground">
                                            UTM content
                                        </dt>
                                        <dd className="font-semibold">
                                            {inquiry.source.utm_content}
                                        </dd>
                                    </div>
                                )}
                                {inquiry.source.landing_url && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-muted-foreground">
                                            Halaman masuk
                                        </dt>
                                        <dd className="truncate font-semibold">
                                            {inquiry.source.landing_url}
                                        </dd>
                                    </div>
                                )}
                                {inquiry.source.referrer && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-muted-foreground">
                                            Referrer
                                        </dt>
                                        <dd className="truncate font-semibold">
                                            {inquiry.source.referrer}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </section>
                    )}

                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Catatan internal</h2>
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                            {inquiry.notes ||
                                'Belum ada catatan untuk lead ini.'}
                        </p>
                    </section>
                </div>

                <aside className="min-w-0 space-y-6 xl:sticky xl:top-24">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-bold">Status lead</h2>
                            <StatusBadge status={inquiry.status} />
                        </div>

                        <dl className="mt-4 space-y-2 border-b border-border pb-4 text-xs">
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Dibuat
                                </dt>
                                <dd className="text-right font-semibold">
                                    {formatDateTime(inquiry.created_at)}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Diperbarui
                                </dt>
                                <dd className="text-right font-semibold">
                                    {formatDateTime(inquiry.updated_at)}
                                </dd>
                            </div>
                            {inquiry.closed_at && (
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Ditutup
                                    </dt>
                                    <dd className="text-right font-semibold">
                                        {formatDateTime(inquiry.closed_at)}
                                    </dd>
                                </div>
                            )}
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">PIC</dt>
                                <dd className="text-right font-semibold">
                                    {inquiry.assignee ?? 'Belum ditugaskan'}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Nilai deal
                                </dt>
                                <dd className="text-right font-semibold">
                                    {formatCurrency(inquiry.deal_value) ?? '—'}
                                </dd>
                            </div>
                        </dl>

                        {canManage ? (
                            <form onSubmit={submit} className="mt-4 space-y-4">
                                <FormField
                                    label="Status"
                                    htmlFor="status"
                                    required
                                    error={form.errors.status}
                                >
                                    <select
                                        id="status"
                                        value={form.data.status}
                                        onChange={(event) =>
                                            form.setData(
                                                'status',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        {statuses.map((status) => (
                                            <option
                                                key={status.value}
                                                value={status.value}
                                            >
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField
                                    label="PIC"
                                    htmlFor="assigned_to"
                                    hint="Kosongkan bila belum ditugaskan."
                                    error={form.errors.assigned_to}
                                >
                                    <select
                                        id="assigned_to"
                                        value={form.data.assigned_to}
                                        onChange={(event) =>
                                            form.setData(
                                                'assigned_to',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        <option value="">
                                            Belum ditugaskan
                                        </option>
                                        {salesUsers.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField
                                    label="Nilai deal (Rupiah)"
                                    htmlFor="deal_value"
                                    hint="Diisi setelah kesepakatan."
                                    error={form.errors.deal_value}
                                >
                                    <input
                                        id="deal_value"
                                        type="number"
                                        min={0}
                                        inputMode="numeric"
                                        value={form.data.deal_value}
                                        onChange={(event) =>
                                            form.setData(
                                                'deal_value',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                </FormField>

                                <FormField
                                    label="Catatan internal"
                                    htmlFor="notes"
                                    error={form.errors.notes}
                                >
                                    <textarea
                                        id="notes"
                                        rows={4}
                                        value={form.data.notes}
                                        onChange={(event) =>
                                            form.setData(
                                                'notes',
                                                event.target.value,
                                            )
                                        }
                                        className={textareaClass}
                                        placeholder="Hasil follow-up, kebutuhan khusus, atau langkah berikutnya…"
                                    />
                                </FormField>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className={`${buttonPrimary} w-full`}
                                >
                                    {form.processing
                                        ? 'Menyimpan…'
                                        : 'Perbarui lead'}
                                </button>
                            </form>
                        ) : (
                            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                                Anda hanya dapat melihat lead. Hubungi admin
                                untuk mengubah status atau menugaskan PIC.
                            </p>
                        )}
                    </section>

                    <div className="rounded-lg border border-border bg-secondary/40 p-4">
                        <div className="flex items-start gap-2.5">
                            <ExternalLink
                                className="mt-0.5 size-4 shrink-0 text-primary"
                                aria-hidden="true"
                            />
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                Balas pelanggan lewat WhatsApp agar riwayat
                                percakapan tetap dalam satu kanal. Gunakan
                                catatan internal untuk merangkum hasilnya.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={admin.inquiries.index.url()}
                        className={`${buttonSecondary} w-full`}
                    >
                        Kembali ke daftar
                    </Link>
                </aside>
            </div>
        </>
    );
}
