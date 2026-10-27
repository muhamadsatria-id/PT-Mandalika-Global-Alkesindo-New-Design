import { Link, router } from '@inertiajs/react';
import { ArrowRight, Search, Users } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    buttonSecondary,
    inputClass,
    PageHeader,
    StatStrip,
} from '@/components/admin/admin-ui';
import Pagination from '@/components/pagination';
import { formatDate } from '@/lib/format';
import admin from '@/routes/admin';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types/catalog';

type CustomerRow = {
    id: number;
    name: string;
    institution: string;
    city: string;
    phone: string;
    email: string | null;
    inquiries_count: number;
    services_count: number;
    created_at: string | null;
};

type CustomersIndexProps = {
    customers: Paginated<CustomerRow>;
    filters: {
        q: string;
    };
    stats: {
        total: number;
        withInquiries: number;
    };
};

export default function CustomersIndex({
    customers,
    filters,
    stats,
}: CustomersIndexProps) {
    const [search, setSearch] = useState(filters.q);

    const apply = (): void => {
        router.get(
            admin.customers.index.url(),
            { q: search || undefined },
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
                eyebrow="Relasi"
                title="Pelanggan"
                description="Riwayat institusi, kontak, lead, dan permintaan servis dalam satu tempat."
            />

            <StatStrip
                items={[
                    { label: 'Total pelanggan', value: stats.total },
                    {
                        label: 'Pernah meminta penawaran',
                        value: stats.withInquiries,
                        hint: 'Punya minimal satu lead',
                    },
                ]}
            />

            <div className="mt-6 rounded-lg border border-border bg-card p-4">
                <form
                    onSubmit={submit}
                    className="grid gap-3 sm:grid-cols-[1fr_auto]"
                >
                    <div className="relative">
                        <label htmlFor="q" className="sr-only">
                            Cari pelanggan
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
                            placeholder="Cari nama, instansi, kota, telepon, atau email…"
                            className={cn(inputClass, 'pl-9')}
                        />
                    </div>
                    <button type="submit" className={buttonSecondary}>
                        Cari
                    </button>
                </form>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
                {customers.data.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <Users
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm font-bold">
                            Pelanggan tidak ditemukan
                        </p>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                            Data pelanggan dibuat otomatis saat lead atau
                            permintaan servis masuk.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[46rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">
                                        Pelanggan
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Kontak
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Kota
                                    </th>
                                    <th className="px-3 py-3 text-center font-bold">
                                        Lead
                                    </th>
                                    <th className="px-3 py-3 text-center font-bold">
                                        Servis
                                    </th>
                                    <th className="px-3 py-3 font-bold">
                                        Terdaftar
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {customers.data.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={admin.customers.show.url(
                                                    customer.id,
                                                )}
                                                className="font-semibold hover:text-primary-strong"
                                            >
                                                {customer.name}
                                            </Link>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {customer.institution}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <p className="text-xs font-medium tabular-nums">
                                                {customer.phone}
                                            </p>
                                            <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
                                                {customer.email ?? '—'}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3 text-xs text-muted-foreground">
                                            {customer.city}
                                        </td>
                                        <td className="px-3 py-3 text-center text-sm font-semibold tabular-nums">
                                            {customer.inquiries_count}
                                        </td>
                                        <td className="px-3 py-3 text-center text-sm font-semibold tabular-nums">
                                            {customer.services_count}
                                        </td>
                                        <td className="px-3 py-3 text-xs whitespace-nowrap text-muted-foreground">
                                            {formatDate(customer.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end">
                                                <Link
                                                    href={admin.customers.show.url(
                                                        customer.id,
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

            <Pagination paginator={customers} label="pelanggan" />
        </>
    );
}
