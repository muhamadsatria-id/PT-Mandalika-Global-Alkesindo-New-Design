import { Link, router } from '@inertiajs/react';
import { ArrowRight, Inbox, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    buttonSecondary,
    inputClass,
    PageHeader,
    StatStrip,
} from '@/components/admin/admin-ui';
import StatusBadge from '@/components/admin/status-badge';
import Pagination from '@/components/pagination';
import { formatCurrency, formatDate } from '@/lib/format';
import admin from '@/routes/admin';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types/catalog';

type InquiryRow = {
    id: number;
    code: string;
    status: string;
    customer: string;
    institution: string;
    city: string;
    phone: string;
    items_count: number;
    assignee: string | null;
    deal_value: number | null;
    created_at: string | null;
};

type StatusOption = {
    value: string;
    label: string;
};

type InquiriesIndexProps = {
    inquiries: Paginated<InquiryRow>;
    filters: {
        q: string;
        status: string;
    };
    statuses: StatusOption[];
    stats: {
        total: number;
        open: number;
        deal: number;
    };
};

export default function InquiriesIndex({
    inquiries,
    filters,
    statuses,
    stats,
}: InquiriesIndexProps) {
    const [search, setSearch] = useState(filters.q);
    const [status, setStatus] = useState(filters.status);

    const apply = (nextStatus = status): void => {
        setStatus(nextStatus);
        router.get(
            admin.inquiries.index.url(),
            {
                q: search || undefined,
                status: nextStatus || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        apply();
    };

    return (
        <>
            <PageHeader
                eyebrow="Penjualan"
                title="Lead & penawaran"
                description="Tindak lanjuti permintaan penawaran yang masuk dari katalog dan WhatsApp."
            />

            <StatStrip
                items={[
                    { label: 'Total lead', value: stats.total },
                    {
                        label: 'Terbuka',
                        value: stats.open,
                        hint: 'Belum deal atau batal',
                    },
                    {
                        label: 'Deal',
                        value: stats.deal,
                        hint: 'Sudah dikonfirmasi',
                    },
                ]}
            />

            <div className="mt-6 rounded-lg border border-border bg-card p-4">
                <form
                    onSubmit={submit}
                    className="grid gap-3 sm:grid-cols-[1.6fr_1fr_auto]"
                >
                    <div className="relative">
                        <label htmlFor="q" className="sr-only">
                            Cari lead
                        </label>
                        <Search
                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <input
                            id="q"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari kode, nama, instansi, atau telepon…"
                            className={cn(inputClass, 'pl-9')}
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="sr-only">
                            Status lead
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(event) => apply(event.target.value)}
                            className={inputClass}
                        >
                            <option value="">Semua status</option>
                            {statuses.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className={buttonSecondary}>
                        Cari
                    </button>
                </form>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
                {inquiries.data.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <Inbox
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm font-bold">
                            Belum ada lead yang cocok
                        </p>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                            Lead baru dari form penawaran akan muncul di sini.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[50rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">
                                        Kode & tanggal
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Pelanggan
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Item
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Status
                                    </th>
                                    <th className="px-3 py-3 font-bold">PIC</th>
                                    <th className="px-3 py-3 font-bold">
                                        Nilai deal
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {inquiries.data.map((inquiry) => (
                                    <tr key={inquiry.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={admin.inquiries.show.url(
                                                    inquiry.id,
                                                )}
                                                className="font-mono text-xs font-bold hover:text-primary-strong"
                                            >
                                                {inquiry.code}
                                            </Link>
                                            <p className="mt-1 text-[0.68rem] text-muted-foreground">
                                                {formatDate(inquiry.created_at)}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <p className="font-semibold">
                                                {inquiry.customer}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {[
                                                    inquiry.institution,
                                                    inquiry.city,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                            </p>
                                            <p className="mt-0.5 text-[0.68rem] text-muted-foreground tabular-nums">
                                                {inquiry.phone}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3 text-sm font-semibold tabular-nums">
                                            {inquiry.items_count}
                                        </td>
                                        <td className="px-3 py-3">
                                            <StatusBadge
                                                status={inquiry.status}
                                            />
                                        </td>
                                        <td className="px-3 py-3 text-xs text-muted-foreground">
                                            {inquiry.assignee ?? '—'}
                                        </td>
                                        <td className="px-3 py-3 text-xs font-semibold whitespace-nowrap">
                                            {formatCurrency(
                                                inquiry.deal_value,
                                            ) ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end">
                                                <Link
                                                    href={admin.inquiries.show.url(
                                                        inquiry.id,
                                                    )}
                                                    className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 text-xs font-semibold hover:bg-secondary"
                                                >
                                                    Detail
                                                    <ArrowRight
                                                        className="size-3"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Pagination paginator={inquiries} label="lead" />
        </>
    );
}
