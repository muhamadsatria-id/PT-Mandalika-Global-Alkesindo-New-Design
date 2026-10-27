import { Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BadgeCheck,
    Calendar,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    ShieldCheck,
    Stethoscope,
    Wrench,
} from 'lucide-react';
import Seo from '@/components/seo';
import { whatsAppLink } from '@/lib/whatsapp';
import { about, contact, home, legal } from '@/routes';
import catalog from '@/routes/catalog';
import service from '@/routes/service';
import type { SharedData } from '@/types';
import type { SeoData } from '@/types/catalog';

type PartnerBrand = {
    id: number;
    name: string;
    logo: string | null;
    website: string | null;
};

type CompanyStat = {
    id: number;
    label: string;
    value: string;
    suffix: string | null;
};

type AboutProps = {
    seo: SeoData;
    profile: {
        name: string;
        tagline: string | null;
        address: string | null;
        hours: string | null;
        email: string | null;
        phone: string | null;
        founded_year: string | null;
    };
    partnerBrands: PartnerBrand[];
    companyStats: CompanyStat[];
};

const values = [
    {
        title: 'Tepat',
        description:
            'Rekomendasi unit disesuaikan dengan kebutuhan ruang, alur kerja, dan anggaran fasilitas kesehatan.',
        icon: Stethoscope,
    },
    {
        title: 'Terbuka',
        description:
            'Spesifikasi, ketersediaan, dan penawaran disampaikan apa adanya, tanpa klaim berlebihan.',
        icon: ShieldCheck,
    },
    {
        title: 'Hadir setelah unit tiba',
        description:
            'Instalasi, pelatihan, dan pendampingan teknis tetap kami jaga hingga alat siap digunakan.',
        icon: Wrench,
    },
];

const services = [
    {
        title: 'Pengadaan Alat Kesehatan',
        description: 'Pemilihan unit sesuai kebutuhan rumah sakit, klinik, dan dinas kesehatan.',
        icon: FileText,
    },
    {
        title: 'Instalasi & Pelatihan',
        description: 'Pemasangan, uji fungsi, dan pelatihan penggunaan oleh tim teknis kami.',
        icon: GraduationCap,
    },
    {
        title: 'Servis & Kalibrasi',
        description: 'Diagnosa, perbaikan, dan perawatan berkala untuk menjaga performa alat.',
        icon: Wrench,
    },
    {
        title: 'Konsultasi Teknis',
        description: 'Pendampingan perencanaan pengadaan dan solusi teknis untuk kebutuhan institusi.',
        icon: Stethoscope,
    },
];

export default function About({ seo, profile, partnerBrands, companyStats }: AboutProps) {
    const { settings } = usePage<SharedData>().props;
    const whatsappNumber = settings.whatsapp_number || profile.phone;
    const quoteLink = whatsappNumber
        ? whatsAppLink(whatsappNumber, 'Halo PT. Mandalika Global Alkesindo, saya ingin berkonsultasi terkait pengadaan alat kesehatan.')
        : null;
    return (
        <>
            <Seo seo={seo} />

            <section className="border-b border-border">
                <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pt-12 pb-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-16 lg:pb-16">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                            <BadgeCheck className="size-3.5 text-primary" aria-hidden="true" />
                            Izin Edar Resmi • Distributor Alat Kesehatan
                        </div>
                        <h1 className="max-w-3xl text-4xl leading-[1.02] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                            Distributor Alat Kesehatan untuk Rumah Sakit, Klinik & Dinas Kesehatan
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                            {profile.tagline ??
                                'PT. Mandalika Global Alkesindo bergerak di pengadaan alat kesehatan, instalasi, servis, dan pendampingan teknis untuk membantu fasilitas kesehatan bekerja lebih andal.'}
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={catalog.index.url()}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                            >
                                Lihat katalog
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            </Link>
                            {quoteLink && (
                                <a
                                    href={quoteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-7 text-sm font-semibold transition-colors hover:bg-secondary"
                                >
                                    <MessageCircle className="size-4" aria-hidden="true" />
                                    Chat via WhatsApp
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary/40 shadow-sm">
                        <img
                            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop"
                            alt="Tim atau fasilitas medis"
                            className="aspect-[4/3] w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="border-b border-border">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Cerita Perusahaan
                            </h2>
                            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                <p>
                                    PT. Mandalika Global Alkesindo adalah distributor alat kesehatan yang berfokus pada pengadaan, instalasi, servis, dan pendampingan teknis untuk rumah sakit, klinik, dan dinas kesehatan di Indonesia.
                                </p>
                                <p>
                                    Kami hadir untuk membantu fasilitas kesehatan memilih peralatan yang tepat, memastikan instalasi berjalan lancar, serta menjaga performa alat lewat layanan servis dan pendampingan teknis berkelanjutan.
                                </p>
                                <p>
                                    Dengan pendekatan yang terbuka dan praktis, kami menjembatani kebutuhan pengadaan institusi dengan unit bersertifikasi dan dukungan teknis yang bisa diandalkan.
                                </p>
                                {(profile.founded_year || profile.address) && (
                                    <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                                        {profile.founded_year && (
                                            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
                                                <Calendar className="size-4 text-primary" aria-hidden="true" />
                                                <span>Berdiri sejak {profile.founded_year}</span>
                                            </div>
                                        )}
                                        {profile.address && (
                                            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
                                                <MapPin className="size-4 text-primary" aria-hidden="true" />
                                                <span>{profile.address}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {companyStats.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {companyStats.map((stat) => (
                                    <div
                                        key={stat.id}
                                        className="rounded-xl border border-border bg-card p-5 text-center shadow-sm"
                                    >
                                        <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                            {stat.value}
                                            {stat.suffix ?? ''}
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="border-b border-border">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8 max-w-2xl">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Nilai Kerja
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Prinsip yang kami pegang di setiap proyek pengadaan dan layanan teknis.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {values.map((value) => {
                            const Icon = value.icon;

                            return (
                                <article
                                    key={value.title}
                                    className="rounded-xl border border-border bg-card p-6 shadow-sm"
                                >
                                    <div className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="size-5" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-lg font-semibold tracking-tight">
                                        {value.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {value.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="border-b border-border">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Cakupan Layanan
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Satu tim menangani pengadaan, instalasi, servis, dan pendampingan teknis untuk menghindari peralihan antar vendor.
                            </p>
                        </div>
                        <Link
                            href={service.index.url()}
                            className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                        >
                            Lihat alur layanan servis
                            <ArrowUpRight className="size-4" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article
                                    key={item.title}
                                    className="rounded-xl border border-border bg-card p-6 shadow-sm"
                                >
                                    <div className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="size-5" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-lg font-semibold tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {partnerBrands.length > 0 && (
                <section className="border-b border-border">
                    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="mb-6 text-center">
                            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                                Brand Partner yang Dilayani
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Beberapa principal resmi yang kami distribusikan.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
                            {partnerBrands.map((brand) => (
                                <div
                                    key={brand.id}
                                    className="flex h-10 items-center justify-center"
                                >
                                    {brand.logo ? (
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="h-8 max-w-[150px] object-contain opacity-70 grayscale transition-opacity hover:opacity-100 hover:grayscale-0"
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-muted-foreground">
                                            {brand.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="border-b border-border">
                <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8 lg:py-16">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Legalitas Ringkas
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                            PT. Mandalika Global Alkesindo memiliki legalitas perusahaan dan dokumen pendukung untuk mendukung pengadaan alat kesehatan bagi instansi pemerintah maupun swasta.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Link
                                href={legal.url()}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                            >
                                Lihat Dokumen Legalitas
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            </Link>
                            {quoteLink && (
                                <a
                                    href={quoteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
                                >
                                    <MessageCircle className="size-4" aria-hidden="true" />
                                    Konsultasi Legalitas
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                            <p className="text-sm font-medium">NIB</p>
                            <p className="mt-1 text-xs text-muted-foreground">Terdaftar</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                            <p className="text-sm font-medium">PAK/IDAK</p>
                            <p className="mt-1 text-xs text-muted-foreground">Tersedia</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                            <p className="text-sm font-medium">Izin Edar</p>
                            <p className="mt-1 text-xs text-muted-foreground">Sesuai kebutuhan</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-border">
                <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8 lg:py-16">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Visi & Misi
                        </h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Visi</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    Menjadi mitra terpercaya fasilitas kesehatan Indonesia dalam pengadaan, instalasi, servis, dan pendampingan teknis alat kesehatan yang andal.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Misi</h3>
                                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    <li>Menyediakan alat kesehatan bersertifikasi sesuai kebutuhan dan anggaran.</li>
                                    <li>Mendampingi instalasi, pelatihan, dan tindak lanjut teknis.</li>
                                    <li>Menjaga performa alat melalui layanan servis dan perawatan berkala.</li>
                                    <li>Menjaga komunikasi terbuka dan transparan dengan setiap mitra.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Lokasi & Jangkauan Layanan
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Berbasis di Mataram, Nusa Tenggara Barat, kami melayani pengiriman, instalasi, dan pendampingan teknis ke rumah sakit, klinik, dan fasilitas kesehatan di seluruh Indonesia.
                        </p>
                        {profile.address && (
                            <div className="mt-4 flex items-start gap-2.5">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                <span className="text-sm text-muted-foreground">{profile.address}</span>
                            </div>
                        )}
                        {profile.email && (
                            <div className="mt-2 flex items-start gap-2.5">
                                <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                <a href={`mailto:${profile.email}`} className="text-sm text-muted-foreground hover:underline">
                                    {profile.email}
                                </a>
                            </div>
                        )}
                        {whatsappNumber && (
                            <div className="mt-2 flex items-start gap-2.5">
                                <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                <span className="text-sm text-muted-foreground">WhatsApp: +{whatsappNumber}</span>
                            </div>
                        )}
                        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-secondary/40 shadow-sm">
                            <iframe
                                title="Lokasi PT. Mandalika Global Alkesindo"
                                src={`https://www.google.com/maps?q=${encodeURIComponent(profile.address ?? 'Mataram, Nusa Tenggara Barat')}&output=embed`}
                                className="aspect-[16/9] w-full"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section id="kontak">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10">
                        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                            <div>
                                <h2 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                                    Butuh penawaran atau konsultasi pengadaan?
                                </h2>
                                <p className="mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
                                    Ceritakan kebutuhan alat kesehatan Anda. Tim kami akan membantu memilih unit yang tepat, menyiapkan penawaran, dan menjadwalkan tindak lanjut.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                                <Link
                                    href={catalog.index.url()}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-foreground px-7 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
                                >
                                    Lihat katalog
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </Link>
                                {quoteLink && (
                                    <a
                                        href={quoteLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary-foreground/40 px-7 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
                                    >
                                        <MessageCircle className="size-4" aria-hidden="true" />
                                        Chat via WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
