import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, MessageCircle, Play, Wrench, GraduationCap, FileText, Stethoscope } from 'lucide-react';
import Seo from '@/components/seo';
import { whatsAppLink } from '@/lib/whatsapp';
import { about, home, legal } from '@/routes';
import catalog from '@/routes/catalog';
import service from '@/routes/service';
import type { SharedData } from '@/types';
import type { ProductCard as ProductCardType } from '@/types/catalog';

const heroBackgrounds = [
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const serviceCards = [
    {
        title: 'Pengadaan Alat Kesehatan',
        description:
            'Rekomendasi unit sesuai kebutuhan ruang, anggaran, dan regulasi untuk rumah sakit, klinik, maupun dinas kesehatan.',
        icon: FileText,
    },
    {
        title: 'Instalasi & Pelatihan',
        description:
            'Pemasangan, uji fungsi, serta pelatihan penggunaan agar tim medis siap mengoperasikan alat dengan aman.',
        icon: GraduationCap,
    },
    {
        title: 'Servis & Kalibrasi',
        description:
            'Diagnosa, perbaikan, perawatan berkala, dan penjadwalan servis untuk menjaga alat tetap andal.',
        icon: Wrench,
    },
    {
        title: 'Konsultasi Teknis',
        description:
            'Pendampingan teknis dan koordinasi perencanaan pengadaan untuk kebutuhan pengadaan institusi.',
        icon: Stethoscope,
    },
];

const steps = [
    {
        number: '01',
        title: 'Ceritakan kebutuhan',
        description:
            'Sampaikan jenis alat, jumlah unit, dan kondisi lokasi lewat WhatsApp.',
    },
    {
        number: '02',
        title: 'Kami siapkan rekomendasi',
        description:
            'Tim menyusun pilihan unit dan penawaran yang sesuai dengan kebutuhan Anda.',
    },
    {
        number: '03',
        title: 'Tindak lanjut',
        description:
            'Pengiriman, pemasangan, atau penjadwalan teknisi dibahas langsung dengan tim.',
    },
];

type HomeTestimonial = {
    id: number;
    name: string;
    role: string | null;
    institution: string | null;
    quote: string;
    rating: number;
};

type HomeFaq = {
    id: number;
    question: string;
    answer: string;
};

type PartnerBrand = {
    id: number;
    name: string;
    logo: string | null;
    website: string | null;
};

type CategoryItem = {
    id: number;
    name: string;
    slug: string;
    products_count: number;
};

type CompanyStat = {
    id: number;
    label: string;
    value: string;
    suffix: string | null;
};

type HomeProps = {
    featuredProducts: ProductCardType[];
    partnerBrands: PartnerBrand[];
    categories: CategoryItem[];
    companyStats: CompanyStat[];
    testimonials: HomeTestimonial[];
    faqs: HomeFaq[];
};

export default function Home({
    featuredProducts,
    partnerBrands,
    categories,
    companyStats,
    testimonials,
    faqs,
}: HomeProps) {
    const { settings } = usePage<SharedData>().props;

    const whatsappNumber = settings.whatsapp_number;
    const salesMessage =
        'Halo PT. Mandalika Global Alkesindo, saya ingin meminta penawaran alat kesehatan.';
    const serviceMessage =
        'Halo PT. Mandalika Global Alkesindo, saya ingin menjadwalkan servis alat kesehatan.';

    const serviceEnabled =
        settings.service_enabled !== 'false' && settings.service_enabled !== false;

    const quoteLink = whatsappNumber
        ? whatsAppLink(whatsappNumber, salesMessage)
        : null;
    const serviceLink =
        serviceEnabled && whatsappNumber
            ? whatsAppLink(whatsappNumber, serviceMessage)
            : null;

    const heroBackground =
        settings.hero_background && settings.hero_background.trim() !== ''
            ? settings.hero_background
            : heroBackgrounds[
                  Math.floor(
                      (Date.parse(String(settings.created_at ?? '')) % 1000) /
                          250,
                  ) % heroBackgrounds.length
              ];

    return (
        <>
            <Seo
                seo={{
                    title: 'Alat kesehatan & layanan servis',
                    description:
                        settings.seo_description ??
                        'Pengadaan alat kesehatan, layanan servis, dan pendampingan teknis untuk rumah sakit, klinik, dan dinas kesehatan di Indonesia.',
                    canonical: home.url(),
                }}
            />

            <section className="relative isolate -mt-24 overflow-hidden border-b border-border sm:-mt-28">
                <img
                    src={heroBackground}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 dark:bg-gradient-to-b dark:from-black/80 dark:via-black/70 dark:to-background" />

                <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-7xl flex-col justify-center px-4 pt-32 pb-16 sm:px-6 lg:px-8 lg:pt-40 lg:pb-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full bg-white/10 px-2 py-1.5 text-center ring-1 ring-white/15 backdrop-blur sm:px-3">
                            <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-neutral-900">
                                Distribusi Resmi
                            </span>
                            <span className="text-xs font-medium text-white/90 sm:text-sm">
                                Alat Kesehatan • Servis • Pendampingan Teknis
                            </span>
                        </div>

                        <h1 className="text-balance text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            Alat medis yang siap dipakai,
                            <br className="hidden sm:block" />
                            bukan sekadar dikirim
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                            Kami membantu rumah sakit, klinik, dan dinas kesehatan
                            memilih peralatan yang tepat, memasangnya, serta menjaga
                            performanya lewat layanan servis dan pendampingan teknis
                            terkurasi dengan izin edar resmi.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href={catalog.index.url()}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90"
                            >
                                Jelajahi katalog
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            </Link>
                            {quoteLink && (
                                <a
                                    href={quoteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-7 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/15"
                                >
                                    <MessageCircle className="size-4" aria-hidden="true" />
                                    Minta penawaran
                                </a>
                            )}
                            {serviceEnabled && serviceLink && (
                                <a
                                    href={serviceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-white/90 transition-colors hover:text-white"
                                >
                                    <Play className="size-4" aria-hidden="true" />
                                    Ajukan servis
                                </a>
                            )}
                        </div>

                        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70">
                            <span>Izin Edar AKL</span>
                            <span className="hidden sm:inline">•</span>
                            <span>E-Katalog LKPP</span>
                            <span className="hidden sm:inline">•</span>
                            <span>CDAKB</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Distributor Resmi</span>
                        </div>
                    </div>
                </div>
            </section>

            {partnerBrands.length > 0 && (
                <section className="border-b border-border">
                    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                            <p className="text-sm font-medium text-muted-foreground">
                                Brand partner resmi
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                                {partnerBrands.map((brand) => (
                                    <div
                                        key={brand.id}
                                        className="flex h-10 items-center justify-center"
                                    >
                                        {brand.logo ? (
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                className="h-8 max-w-[140px] object-contain opacity-70 grayscale transition-opacity hover:opacity-100 hover:grayscale-0"
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
                    </div>
                </section>
            )}

            {categories.length > 0 && (
                <section className="border-b border-border">
                    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    Jelajahi kategori produk
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                                    Temukan peralatan medis sesuai kebutuhan fasilitas kesehatan Anda.
                                </p>
                            </div>
                            <Link
                                href={catalog.index.url()}
                                className="hidden items-center gap-1.5 text-sm font-medium hover:underline sm:inline-flex"
                            >
                                Lihat katalog
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={catalog.index.url({ query: { category: category.slug } })}
                                    className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                                >
                                    <div>
                                        <h3 className="text-sm font-medium tracking-tight group-hover:text-primary">
                                            {category.name}
                                        </h3>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {category.products_count} produk
                                        </p>
                                    </div>
                                    <ArrowUpRight className="mt-4 size-4 self-end text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {featuredProducts.length > 0 && (
                <section className="border-b border-border">
                    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    Produk Pilihan
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                                    Produk pilihan untuk kebutuhan rumah sakit, klinik, dan fasilitas kesehatan.
                                </p>
                            </div>
                            <Link
                                href={catalog.index.url()}
                                className="hidden items-center gap-1.5 text-sm font-medium hover:underline sm:inline-flex"
                            >
                                Lihat semua
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            </Link>
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    const container = document.getElementById('featured-products-carousel');
                                    if (container) {
                                        container.scrollBy({ left: -280, behavior: 'smooth' });
                                    }
                                }}
                                className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 p-2 shadow-sm backdrop-blur transition-colors hover:bg-secondary lg:inline-flex"
                                aria-label="Geser ke kiri"
                            >
                                <ArrowUpRight className="size-4 rotate-[225deg]" aria-hidden="true" />
                            </button>
                            <div
                                id="featured-products-carousel"
                                className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >
                                {featuredProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={product.url}
                                        className="group w-[240px] flex-none snap-start rounded-xl md:w-[260px]"
                                    >
                                        <div className="relative flex h-[320px] w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
                                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gradient-to-br from-secondary via-secondary/60 to-background" />
                                                )}
                                                {product.brand && (
                                                    <span className="absolute left-2 top-2 rounded-md bg-background/90 px-1.5 py-0.5 text-xs font-medium text-foreground backdrop-blur">
                                                        {product.brand}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between p-3">
                                                <div>
                                                    <h3 className="line-clamp-2 text-sm font-medium tracking-tight">
                                                        {product.name}
                                                    </h3>
                                                    {product.category && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {product.category}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">
                                                        {product.priceLabel ?? 'Hubungi kami'}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-foreground">
                                                        Lihat detail
                                                        <ArrowUpRight className="size-3" aria-hidden="true" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const container = document.getElementById('featured-products-carousel');
                                    if (container) {
                                        container.scrollBy({ left: 280, behavior: 'smooth' });
                                    }
                                }}
                                className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 p-2 shadow-sm backdrop-blur transition-colors hover:bg-secondary lg:inline-flex"
                                aria-label="Geser ke kanan"
                            >
                                <ArrowUpRight className="size-4 rotate-45" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="mt-4 sm:hidden">
                            <Link
                                href={catalog.index.url()}
                                className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                            >
                                Lihat semua produk
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {serviceEnabled && (
                <section
                    id="layanan"
                    className="scroll-mt-24 border-b border-border"
                >
                    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                                    Layanan Kami
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    Bukan sekadar distributor. Kami mendampingi pengadaan, instalasi, servis, dan konsultasi teknis untuk memastikan alat siap dipakai.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href={service.index.url()}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                                >
                                    Lihat alur layanan servis
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </Link>
                                {serviceLink && (
                                    <a
                                        href={serviceLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                                    >
                                        Ajukan servis lewat WhatsApp
                                        <ArrowUpRight className="size-4" aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {serviceCards.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Icon className="size-5" aria-hidden="true" />
                                        </div>
                                        <h3 className="text-lg font-semibold tracking-tight">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {(settings.company_name || companyStats.length > 0) && (
                <section className="border-b border-border">
                    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                            <div>
                                <h2 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                                    Tentang PT. Mandalika Global Alkesindo
                                </h2>
                                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    PT. Mandalika Global Alkesindo adalah distributor alat kesehatan yang berfokus pada pengadaan, instalasi, servis, dan pendampingan teknis untuk rumah sakit, klinik, dan dinas kesehatan di Indonesia. Kami mengutamakan unit bersertifikasi, proses pengadaan yang transparan, serta dukungan teknis berkelanjutan.
                                </p>
                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <Link
                                        href={about.url()}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                                    >
                                        Selengkapnya tentang kami
                                        <ArrowUpRight className="size-4" aria-hidden="true" />
                                    </Link>
                                    <Link
                                        href={legal.url()}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                                    >
                                        Lihat dokumen legalitas
                                        <ArrowUpRight className="size-4" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                            {companyStats.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
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
            )}

            <section
                id="cara-kerja"
                className="scroll-mt-24 border-b border-border bg-secondary/30"
            >
                <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Tiga langkah, tanpa proses berbelit.
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Sejak pesan pertama sampai unit siap dipakai,
                            semuanya dibahas dengan tim yang sama.
                        </p>
                    </div>

                    <ol className="mt-10 grid gap-8 md:grid-cols-3">
                        {steps.map((step, index) => (
                            <li
                                key={step.number}
                                className={
                                    index === 0
                                        ? 'border-t-2 border-primary pt-5'
                                        : 'border-t-2 border-border pt-5'
                                }
                            >
                                <span className="text-3xl font-extrabold tracking-tight text-primary-strong tabular-nums">
                                    {step.number}
                                </span>
                                <h3 className="mt-4 text-lg font-bold tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {testimonials.length > 0 && (
                <section className="border-b border-border">
                    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                                Dipercaya fasilitas kesehatan
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Pengalaman dari mitra yang telah menggunakan layanan pengadaan dan servis kami.
                            </p>
                        </div>
                        <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            {testimonials.map((testimonial) => (
                                <blockquote
                                    key={testimonial.id}
                                    className="rounded-xl border border-border bg-card p-6 shadow-sm"
                                >
                                    <p className="text-base leading-relaxed text-muted-foreground">
                                        “{testimonial.quote}”
                                    </p>
                                    <footer className="mt-4 text-sm">
                                        <div className="font-medium text-foreground">
                                            {testimonial.name}
                                        </div>
                                        {(testimonial.role || testimonial.institution) && (
                                            <div className="mt-1 text-muted-foreground">
                                                {[testimonial.role, testimonial.institution]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                            </div>
                                        )}
                                    </footer>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {faqs.length > 0 && (
                <section
                    id="faq"
                    className="scroll-mt-24 border-b border-border"
                >
                    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                        <div className="mb-12 text-center">
                            <p className="mb-3 text-sm font-semibold text-primary">
                                FAQ
                            </p>
                            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                Pertanyaan yang sering diajukan
                            </h2>
                            <p className="mx-auto max-w-xl text-muted-foreground">
                                Kami merangkum jawaban untuk pertanyaan yang
                                paling sering diajukan seputar produk,
                                legalitas, dan layanan servis.
                            </p>
                        </div>

                        <div className="divide-y divide-border border-y border-border">
                            {faqs.map((faq, index) => (
                                <details
                                    key={faq.id}
                                    open={index === 0}
                                    className="group py-5"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">
                                        {faq.question}
                                        <span
                                            className="text-muted-foreground transition-transform group-open:rotate-45"
                                            aria-hidden="true"
                                        >
                                            +
                                        </span>
                                    </summary>
                                    <div className="mt-3 text-muted-foreground">
                                        {faq.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}



            <section id="kontak" className="scroll-mt-24">
                <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="relative overflow-hidden rounded-lg bg-primary px-6 py-10 text-primary-foreground sm:px-10">
                        <div
                            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full border border-primary-foreground/15"
                            aria-hidden="true"
                        />
                        <div
                            className="pointer-events-none absolute right-24 -bottom-16 size-40 rounded-full bg-primary-foreground/5"
                            aria-hidden="true"
                        />

                        <div className="relative lg:flex lg:items-end lg:justify-between lg:gap-12">
                            <div className="max-w-xl">
                                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    Butuh penawaran atau jadwal servis?
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed sm:text-base">
                                    Kirim kebutuhan Anda lewat WhatsApp. Tim
                                    kami akan membantu memilih unit, menyiapkan
                                    penawaran, atau menjadwalkan teknisi.
                                </p>
                            </div>

                            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
                                {quoteLink && (
                                    <a
                                        href={quoteLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary-foreground px-6 text-sm font-bold text-primary transition-opacity hover:opacity-90"
                                    >
                                        Minta penawaran
                                        <ArrowUpRight
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </a>
                                )}
                                {serviceEnabled && (
                                    <Link
                                        href={service.index.url()}
                                        className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground/40 px-6 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
                                    >
                                        Ajukan servis
                                    </Link>
                                )}
                                {settings.company_email && (
                                    <a
                                        href={`mailto:${settings.company_email}`}
                                        className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground/40 px-6 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
                                    >
                                        Kirim email
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
