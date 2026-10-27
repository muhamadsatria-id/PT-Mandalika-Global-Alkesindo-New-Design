import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Tag,
    UserRound,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/admin-ui';
import StatusBadge from '@/components/admin/status-badge';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import admin from '@/routes/admin';
import type { SharedData } from '@/types';

type CustomerDetail = {
    id: number;
    name: string;
    institution: string;
    city: string;
    phone: string;
    email: string | null;
    notes: string | null;
    tags: string[];
    created_at: string | null;
};

type InquiryRow = {
    id: number;
    code: string;
    status: string;
    items_count: number;
    deal_value: number | null;
    created_at: string | null;
};

type ServiceRow = {
    id: number;
    code: string;
    device: string;
    status: string;
    created_at: string | null;
};

type CustomerShowProps = {
    customer: CustomerDetail;
    inquiries: InquiryRow[];
    services: ServiceRow[];
};

export default function CustomerShow({
    customer,
    inquiries,
    services,
}: CustomerShowProps) {
    const { auth } = usePage<SharedData>().props;
    const permissions = auth.user?.permissions ?? [];
    const canViewInquiries =
        permissions.includes('inquiries.view') ||
        permissions.includes('inquiries.manage');
    const canViewServices =
        permissions.includes('services.view') ||
        permissions.includes('services.manage');

    const whatsappUrl = `https://wa.me/${customer.phone}`;

    return (
        <>
            <PageHeader
                eyebrow="Pelanggan"
                title={customer.name}
                description={`${customer.institution} · ${customer.city}`}
                back={{
                    href: admin.customers.index.url(),
                    label: 'Kembali ke daftar pelanggan',
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
                        {customer.email && (
                            <a
                                href={`mailto:${customer.email}`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold transition-colors hover:bg-secondary"
                            >
                                <Mail className="size-4" aria-hidden="true" />
                                Email
                            </a>
                        )}
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.65fr_1.35fr] xl:items-start">
                <aside className="min-w-0 space-y-6 xl:sticky xl:top-24">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <div className="flex items-center gap-3">
                            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary-strong">
                                <UserRound
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold">
                                    {customer.name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {customer.institution}
                                </p>
                            </div>
                        </div>

                        <dl className="mt-5 space-y-3 text-sm">
                            <div className="flex items-start gap-2.5">
                                <Phone
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <div className="min-w-0">
                                    <dt className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                        Telepon
                                    </dt>
                                    <dd className="mt-0.5 font-medium tabular-nums">
                                        <a
                                            href={`tel:${customer.phone}`}
                                            className="hover:text-primary-strong"
                                        >
                                            {customer.phone}
                                        </a>
                                    </dd>
                                </div>
                            </div>

                            {customer.email && (
                                <div className="flex items-start gap-2.5">
                                    <Mail
                                        className="mt-0.5 size-4 shrink-0 text-primary"
                                        aria-hidden="true"
                                    />
                                    <div className="min-w-0">
                                        <dt className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                            Email
                                        </dt>
                                        <dd className="mt-0.5 truncate font-medium">
                                            <a
                                                href={`mailto:${customer.email}`}
                                                className="hover:text-primary-strong"
                                            >
                                                {customer.email}
                                            </a>
                                        </dd>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-2.5">
                                <MapPin
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <div className="min-w-0">
                                    <dt className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                        Kota
                                    </dt>
                                    <dd className="mt-0.5 font-medium">
                                        {customer.city}
                                    </dd>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <CalendarDays
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <div className="min-w-0">
                                    <dt className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                        Pelanggan sejak
                                    </dt>
                                    <dd className="mt-0.5 font-medium">
                                        {formatDate(customer.created_at)}
                                    </dd>
                                </div>
                            </div>
                        </dl>

                        {customer.tags.length > 0 && (
                            <div className="mt-5 border-t border-border pt-4">
                                <p className="flex items-center gap-1.5 text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                    <Tag
                                        className="size-3"
                                        aria-hidden="true"
                                    />
                                    Tag
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {customer.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] font-semibold"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Catatan</h2>
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                            {customer.notes ||
                                'Belum ada catatan untuk pelanggan ini.'}
                        </p>
                    </section>
                </aside>

                <div className="min-w-0 space-y-6">
                    <section className="overflow-hidden rounded-lg border border-border bg-card">
                        <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                            <h2 className="text-sm font-bold">
                                Riwayat penawaran
                            </h2>
                            <span className="text-xs text-muted-foreground">
                                {inquiries.length} lead
                            </span>
                        </div>

                        {inquiries.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                                Belum ada permintaan penawaran.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[32rem] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                            <th className="px-5 py-2.5 font-bold">
                                                Kode
                                            </th>
                                            <th className="px-3 py-2.5 font-bold">
                                                Status
                                            </th>
                                            <th className="px-3 py-2.5 text-center font-bold">
                                                Item
                                            </th>
                                            <th className="px-3 py-2.5 text-right font-bold">
                                                Nilai deal
                                            </th>
                                            <th className="px-5 py-2.5 text-right font-bold">
                                                Tanggal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {inquiries.map((inquiry) => (
                                            <tr key={inquiry.id}>
                                                <td className="px-5 py-3">
                                                    {canViewInquiries ? (
                                                        <Link
                                                            href={admin.inquiries.show.url(
                                                                inquiry.id,
                                                            )}
                                                            className="font-mono text-xs font-bold hover:text-primary-strong"
                                                        >
                                                            {inquiry.code}
                                                        </Link>
                                                    ) : (
                                                        <span className="font-mono text-xs font-bold">
                                                            {inquiry.code}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <StatusBadge
                                                        status={inquiry.status}
                                                    />
                                                </td>
                                                <td className="px-3 py-3 text-center text-xs font-semibold tabular-nums">
                                                    {inquiry.items_count}
                                                </td>
                                                <td className="px-3 py-3 text-right text-xs font-semibold whitespace-nowrap">
                                                    {formatCurrency(
                                                        inquiry.deal_value,
                                                    ) ?? '—'}
                                                </td>
                                                <td className="px-5 py-3 text-right text-xs whitespace-nowrap text-muted-foreground">
                                                    {formatDate(
                                                        inquiry.created_at,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section className="overflow-hidden rounded-lg border border-border bg-card">
                        <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                            <h2 className="text-sm font-bold">
                                Riwayat servis
                            </h2>
                            <span className="text-xs text-muted-foreground">
                                {services.length} permintaan
                            </span>
                        </div>

                        {services.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                                Belum ada permintaan servis.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[32rem] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                            <th className="px-5 py-2.5 font-bold">
                                                Kode
                                            </th>
                                            <th className="px-3 py-2.5 font-bold">
                                                Alat
                                            </th>
                                            <th className="px-3 py-2.5 font-bold">
                                                Status
                                            </th>
                                            <th className="px-5 py-2.5 text-right font-bold">
                                                Tanggal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {services.map((service) => (
                                            <tr key={service.id}>
                                                <td className="px-5 py-3 font-mono text-xs font-bold">
                                                    {canViewServices ? (
                                                        <Link
                                                            href={admin.services.show.url(
                                                                service.id,
                                                            )}
                                                            className="hover:text-primary-strong"
                                                        >
                                                            {service.code}
                                                        </Link>
                                                    ) : (
                                                        service.code
                                                    )}
                                                </td>
                                                <td className="px-3 py-3">
                                                    {service.device}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <StatusBadge
                                                        status={service.status}
                                                    />
                                                </td>
                                                <td className="px-5 py-3 text-right text-xs whitespace-nowrap text-muted-foreground">
                                                    {formatDateTime(
                                                        service.created_at,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
