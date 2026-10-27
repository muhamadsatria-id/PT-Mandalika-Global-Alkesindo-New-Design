import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, CircleDashed } from 'lucide-react';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';
import type { SharedData } from '@/types';

type DashboardProps = {
    stats: {
        products: number;
        publishedProducts: number;
        openInquiries: number;
        activeServices: number;
    };
    latestProducts: Array<{
        id: number;
        name: string;
        brand: string | null;
        price: string | null;
        stock_status: string;
        is_published: boolean;
        edit_url: string;
    }>;
};

const numberFormat = new Intl.NumberFormat('id-ID');

export default function Dashboard({ stats, latestProducts }: DashboardProps) {
    const { auth, settings } = usePage<SharedData>().props;

    const firstName = auth.user?.name.split(' ')[0] ?? 'Tim';
    const today = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    const whatsappNumber = settings.whatsapp_number;
    const whatsappConfigured =
        Boolean(whatsappNumber) && whatsappNumber !== '6281234567890';
    const profileComplete = Boolean(
        settings.company_address &&
        settings.company_email &&
        settings.company_hours,
    );

    const statCards = [
        {
            label: 'Total produk',
            value: stats.products,
            hint: `${numberFormat.format(stats.publishedProducts)} terbit`,
        },
        {
            label: 'Lead terbuka',
            value: stats.openInquiries,
            hint: 'Belum deal atau batal',
        },
        {
            label: 'Servis aktif',
            value: stats.activeServices,
            hint: 'Belum selesai',
        },
        {
            label: 'Produk terbit',
            value: stats.publishedProducts,
            hint: `Dari ${numberFormat.format(stats.products)} produk`,
        },
    ];

    const readiness = [
        {
            label: 'Katalog produk',
            ready: stats.publishedProducts > 0,
            detail:
                stats.publishedProducts > 0
                    ? `${numberFormat.format(stats.publishedProducts)} produk sudah terbit`
                    : 'Belum ada produk terbit',
        },
        {
            label: 'Nomor WhatsApp',
            ready: whatsappConfigured,
            detail: whatsappConfigured
                ? `Aktif: ${whatsappNumber}`
                : 'Masih memakai nomor placeholder',
        },
        {
            label: 'Profil perusahaan',
            ready: profileComplete,
            detail: profileComplete
                ? 'Alamat, email, dan jam kerja terisi'
                : 'Lengkapi alamat, email, dan jam kerja',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[0.65rem] font-bold tracking-[0.18em] text-accent-foreground uppercase">
                        Dashboard
                    </p>
                    <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Selamat datang, {firstName}.
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {today} ·{' '}
                        {settings.company_name ??
                            'PT. Mandalika Global Alkesindo'}
                    </p>
                </div>
                <p className="text-xs text-muted-foreground">
                    Peran Anda:{' '}
                    <span className="font-semibold text-foreground">
                        {auth.user?.role ?? 'Tim internal'}
                    </span>
                </p>
            </div>

            {!whatsappConfigured && (
                <div className="mt-6 flex gap-3 rounded-md border border-warning/35 bg-warning/5 p-4">
                    <AlertTriangle
                        className="mt-0.5 size-4 shrink-0 text-warning"
                        aria-hidden="true"
                    />
                    <div className="text-sm">
                        <p className="font-semibold">
                            Nomor WhatsApp belum disesuaikan
                        </p>
                        <p className="mt-1 leading-relaxed text-muted-foreground">
                            Situs masih memakai nomor contoh{' '}
                            <span className="font-mono text-xs">
                                {whatsappNumber ?? '(kosong)'}
                            </span>
                            . Ganti dengan nomor resmi sebelum situs
                            dipublikasikan agar pengunjung tidak menghubungi
                            nomor yang salah.
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-card p-5">
                        <p className="text-[0.62rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                            {stat.label}
                        </p>
                        <p className="mt-3 text-3xl font-extrabold tracking-tight tabular-nums">
                            {numberFormat.format(stat.value)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {stat.hint}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <section className="min-w-0 rounded-lg border border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <div>
                            <h2 className="text-sm font-bold tracking-tight">
                                Produk terbaru
                            </h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Lima entri terakhir di katalog
                            </p>
                        </div>
                        <Link
                            href={admin.products.index.url()}
                            className="text-xs font-semibold text-primary-strong hover:underline"
                        >
                            Kelola produk
                        </Link>
                    </div>

                    {latestProducts.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                            <p className="text-sm font-semibold">
                                Katalog masih kosong
                            </p>
                            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                                Jalankan seeder katalog atau tambahkan produk
                                pertama untuk mulai menampilkan etalase.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                        <th className="px-5 py-2.5 font-bold">
                                            Produk
                                        </th>
                                        <th className="px-3 py-2.5 font-bold">
                                            Brand
                                        </th>
                                        <th className="px-3 py-2.5 font-bold">
                                            Harga
                                        </th>
                                        <th className="px-5 py-2.5 text-right font-bold">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {latestProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-5 py-3">
                                                <Link
                                                    href={product.edit_url}
                                                    className="font-semibold hover:text-primary-strong"
                                                >
                                                    {product.name}
                                                </Link>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Stok: {product.stock_status}
                                                </p>
                                            </td>
                                            <td className="px-3 py-3 text-muted-foreground">
                                                {product.brand ?? '—'}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                {product.price ??
                                                    'Hubungi kami'}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span
                                                    className={cn(
                                                        'inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold',
                                                        product.is_published
                                                            ? 'bg-success/10 text-success'
                                                            : 'bg-secondary text-muted-foreground',
                                                    )}
                                                >
                                                    {product.is_published
                                                        ? 'Terbit'
                                                        : 'Draf'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="min-w-0 rounded-lg border border-border bg-card">
                    <div className="border-b border-border px-5 py-4">
                        <h2 className="text-sm font-bold tracking-tight">
                            Kesiapan situs
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Pemeriksaan data dasar sebelum rilis
                        </p>
                    </div>

                    <ul className="divide-y divide-border">
                        {readiness.map((item) => (
                            <li
                                key={item.label}
                                className="flex gap-3 px-5 py-4"
                            >
                                {item.ready ? (
                                    <CheckCircle2
                                        className="mt-0.5 size-4 shrink-0 text-success"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <CircleDashed
                                        className="mt-0.5 size-4 shrink-0 text-warning"
                                        aria-hidden="true"
                                    />
                                )}
                                <div>
                                    <p className="text-sm font-semibold">
                                        {item.label}
                                    </p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                        {item.detail}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-border px-5 py-4">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            Modul katalog, lead, pelanggan, dan servis sudah
                            aktif. Lengkapi data perusahaan dan verifikasi nomor
                            WhatsApp sebelum situs dipublikasikan.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}
