import { Link, router } from '@inertiajs/react';
import { ArrowRight, ExternalLink, Search, Wrench } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    buttonSecondary,
    inputClass,
    PageHeader,
    StatStrip,
} from '@/components/admin/admin-ui';
import StatusBadge from '@/components/admin/status-badge';
import Pagination from '@/components/pagination';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import admin from '@/routes/admin';
import { cn } from '@/lib/utils';
import service from '@/routes/service';
import type { Paginated } from '@/types/catalog';

type ServiceRow = {
    id: number;
    code: string;
    status: string;
    equipment_name: string;
    brand: string | null;
    model: string | null;
    customer: string;
    institution: string | null;
    city: string | null;
    phone: string;
    technician: string | null;
    preference: string;
    estimated_cost: number | null;
    scheduled_at: string | null;
    created_at: string | null;
};

type Option = {
    value: string;
    label: string;
};

type Technician = {
    id: number;
    name: string;
};

type ServicesIndexProps = {
    services: Paginated<ServiceRow>;
    filters: {
        q: string;
        status: string;
        technician: string;
    };
    statuses: Option[];
    technicians: Technician[];
    stats: {
        total: number;
        active: number;
        scheduled: number;
        completed: number;
    };
};

export default function ServicesIndex({
    services,
    filters,
    statuses,
    technicians,
    stats,
}: ServicesIndexProps) {
    const [search, setSearch] = useState(filters.q);
    const [status, setStatus] = useState(filters.status);
    const [technician, setTechnician] = useState(filters.technician);

    const apply = (nextStatus = status, nextTechnician = technician): void => {
        setStatus(nextStatus);
        setTechnician(nextTechnician);
        router.get(
            admin.services.index.url(),
            {
                q: search || undefined,
                status: nextStatus || undefined,
                technician: nextTechnician || undefined,
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
                eyebrow="Layanan"
                title="Servis & perbaikan"
                description="Kelola tiket servis, penugasan teknisi, dan perkembangan pekerjaan dalam satu alur."
                actions={
                    <a
                        href={service.index.url()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonSecondary}
                    >
                        <ExternalLink className="size-4" aria-hidden="true" />
                        Halaman publik
                    </a>
                }
            />

            <StatStrip
                items={[
                    {
                        label: 'Total tiket',
                        value: stats.total,
                        hint: 'Seluruh permintaan servis',
                    },
                    {
                        label: 'Masih aktif',
                        value: stats.active,
                        hint: 'Belum selesai atau batal',
                    },
                    {
                        label: 'Dijadwalkan',
                        value: stats.scheduled,
                        hint: 'Menunggu kunjungan atau kirim',
                    },
                    {
                        label: 'Selesai',
                        value: stats.completed,
                        hint: 'Selesai, diambil, atau dikirim',
                    },
                ]}
            />

            <div className="mt-6 rounded-lg border border-border bg-card p-4">
                <form
                    onSubmit={submit}
                    className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
                >
                    <div className="relative">
                        <label htmlFor="q" className="sr-only">
                            Cari tiket servis
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
                            placeholder="Cari kode, alat, brand, atau pelanggan…"
                            className={cn(inputClass, 'pl-9')}
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="sr-only">
                            Status tiket
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

                    <div>
                        <label htmlFor="technician" className="sr-only">
                            Teknisi
                        </label>
                        <select
                            id="technician"
                            value={technician}
                            onChange={(event) =>
                                apply(status, event.target.value)
                            }
                            className={inputClass}
                        >
                            <option value="">Semua teknisi</option>
                            {technicians.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
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
                {services.data.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <Wrench
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm font-bold">
                            Belum ada tiket yang cocok
                        </p>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                            Permintaan servis dari formulir publik akan muncul
                            di sini.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[62rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">
                                        Kode & tanggal
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Pelanggan
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Alat
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Teknisi
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Status
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Estimasi
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {services.data.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={admin.services.show.url(
                                                    item.id,
                                                )}
                                                className="font-mono text-xs font-bold hover:text-primary-strong"
                                            >
                                                {item.code}
                                            </Link>
                                            <p className="mt-1 text-[0.68rem] text-muted-foreground">
                                                {formatDate(item.created_at)}
                                            </p>
                                            <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
                                                {item.preference}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <p className="font-semibold">
                                                {item.customer}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {[item.institution, item.city]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                            </p>
                                            <p className="mt-0.5 text-[0.68rem] text-muted-foreground tabular-nums">
                                                {item.phone}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <p className="font-semibold">
                                                {item.equipment_name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {[item.brand, item.model]
                                                    .filter(Boolean)
                                                    .join(' · ') || '—'}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3 text-xs text-muted-foreground">
                                            {item.technician ??
                                                'Belum ditugaskan'}
                                        </td>
                                        <td className="px-3 py-3">
                                            <StatusBadge status={item.status} />
                                            {item.scheduled_at && (
                                                <p className="mt-1 text-[0.68rem] text-muted-foreground">
                                                    {formatDateTime(
                                                        item.scheduled_at,
                                                    )}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-xs font-semibold whitespace-nowrap">
                                            {formatCurrency(
                                                item.estimated_cost,
                                            ) ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end">
                                                <Link
                                                    href={admin.services.show.url(
                                                        item.id,
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

            <Pagination paginator={services} label="tiket" />
        </>
    );
}
