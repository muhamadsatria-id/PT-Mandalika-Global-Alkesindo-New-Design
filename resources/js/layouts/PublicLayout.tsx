import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    ClipboardList,
    Clock,
    Globe,
    Mail,
    MapPin,
    Menu,
    MessageCircle,
    Music,
    X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import ThemeToggle from '@/components/theme-toggle';
import WhatsAppFloat from '@/components/ui/whatsapp-float';
import { useQuote } from '@/lib/quote';
import { defaultWhatsAppMessage, whatsAppLink } from '@/lib/whatsapp';
import {
    about,
    brands,
    contact,
    gallery,
    home,
    legal,
    privacy,
} from '@/routes';
import catalog from '@/routes/catalog';
import quote from '@/routes/quote';
import service from '@/routes/service';
import type { SharedData } from '@/types';

type PublicLayoutProps = {
    children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { settings, flash } = usePage<SharedData>().props;
    const quoteItems = useQuote();
    const [menuOpen, setMenuOpen] = useState(false);
    const serviceEnabled =
        settings.service_enabled !== 'false' && settings.service_enabled !== false;
    const navigation = [
        { label: 'Beranda', href: home.url(), anchor: false },
        { label: 'Tentang', href: about.url(), anchor: false },
        { label: 'E-Catalogue', href: catalog.index.url(), anchor: false },
        { label: 'Brands', href: brands.url(), anchor: false },
        { label: 'Legalitas', href: legal.url(), anchor: false },
        { label: 'Galeri', href: gallery.url(), anchor: false },
        { label: 'Kontak', href: contact.url(), anchor: false },
        ...(serviceEnabled
            ? [{ label: 'Layanan', href: service.index.url(), anchor: false }]
            : []),
    ];

    const whatsappNumber = settings.whatsapp_number;

    const organizationJsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PT. Mandalika Global Alkesindo',
        url: home.url(),
        ...(whatsappNumber ? { telephone: `+${whatsappNumber}` } : {}),
        ...(settings.company_email ? { email: settings.company_email } : {}),
        ...(settings.company_address
            ? {
                  address: {
                      '@type': 'PostalAddress',
                      streetAddress: settings.company_address,
                      addressCountry: 'ID',
                  },
              }
            : {}),
        ...(settings.company_hours
            ? { openingHours: settings.company_hours }
            : {}),
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head>
                <meta
                    head-key="description"
                    name="description"
                    content={
                        settings.seo_description ??
                        'Pengadaan alat kesehatan, layanan servis, dan pendampingan teknis untuk rumah sakit, klinik, dan dinas di Indonesia.'
                    }
                />
            </Head>

            <a
                href="#konten"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
            >
                Lewati ke konten
            </a>

            <header className="fixed inset-x-0 top-0 z-40">
                <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4 rounded-full border border-border bg-background px-3 py-2 shadow-none dark:shadow-sm sm:px-4">
                        <Link
                            href={home.url()}
                            className="group inline-flex items-center gap-2.5"
                        >
                            <img
                                src="/mga.svg"
                                alt="PT. Mandalika Global Alkesindo"
                                className="h-9 w-auto"
                            />
                            <span className="hidden flex-col gap-0.5 leading-none sm:flex">
                                <span className="text-sm font-extrabold tracking-tight">
                                    Mandalika Global
                                </span>
                                <span className="text-[0.7rem] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                                    Alkesindo
                                </span>
                            </span>
                            <span className="sr-only">— beranda</span>
                        </Link>

                        <nav
                            className="hidden items-center gap-1 rounded-full px-1 py-1 md:flex"
                            aria-label="Navigasi utama"
                        >
                            {navigation.map((item) =>
                                item.anchor ? (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                    >
                                        {item.label}
                                    </Link>
                                ),
                            )}
                        </nav>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Link
                                href={quote.index.url()}
                                className="relative inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                aria-label={`Daftar penawaran, ${quoteItems.length} produk`}
                            >
                                <ClipboardList
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                {quoteItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-primary text-[0.7rem] font-extrabold text-primary-foreground">
                                        {quoteItems.length > 9
                                            ? '9+'
                                            : quoteItems.length}
                                    </span>
                                )}
                            </Link>

                            <ThemeToggle />

                            {whatsappNumber && (
                                <a
                                    href={whatsAppLink(
                                        whatsappNumber,
                                        defaultWhatsAppMessage,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 lg:inline-flex"
                                >
                                    <MessageCircle
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    WhatsApp
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </a>
                            )}

                            <button
                                type="button"
                                onClick={() => setMenuOpen((open) => !open)}
                                className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
                                aria-expanded={menuOpen}
                                aria-controls="menu-publik"
                                aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
                            >
                                {menuOpen ? (
                                    <X className="size-4" aria-hidden="true" />
                                ) : (
                                    <Menu className="size-4" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {menuOpen && (
                    <div
                        id="menu-publik"
                        className="mx-auto mt-2 max-w-7xl px-4 sm:px-6 lg:px-8 md:hidden"
                    >
                        <div className="rounded-2xl border border-border bg-background p-3 shadow-lg">
                            <nav
                                className="flex flex-col"
                                aria-label="Navigasi seluler"
                            >
                                {navigation.map((item) =>
                                    item.anchor ? (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                                        >
                                            {item.label}
                                        </Link>
                                    ),
                                )}
                                <Link
                                    href={quote.index.url()}
                                    onClick={() => setMenuOpen(false)}
                                    className="mt-1 flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                                >
                                    Daftar penawaran
                                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold">
                                        {quoteItems.length}
                                    </span>
                                </Link>
                            </nav>

                            {whatsappNumber && (
                                <a
                                    href={whatsAppLink(
                                        whatsappNumber,
                                        defaultWhatsAppMessage,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                                >
                                    <MessageCircle
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Chat via WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {flash?.success && (
                <div
                    role="status"
                    className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-md border border-success/30 bg-card px-4 py-3 text-sm shadow-lg"
                >
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div
                    role="alert"
                    className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-md border border-destructive/30 bg-card px-4 py-3 text-sm shadow-lg"
                >
                    {flash.error}
                </div>
            )}

            <main id="konten" className="flex-1 pt-24 sm:pt-28">
                {children}
            </main>

            <footer className="border-t border-border bg-secondary/40">
                <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                    <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-14">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <img
                                    src="/mga.svg"
                                    alt="PT. Mandalika Global Alkesindo"
                                    className="h-8 w-auto"
                                />
                                <span className="text-sm font-extrabold tracking-tight">
                                    {settings.company_name ??
                                        'PT. Mandalika Global Alkesindo'}
                                </span>
                            </div>
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                                {settings.company_name ??
                                    'PT. Mandalika Global Alkesindo'}{' '}
                                adalah distributor alat kesehatan yang berfokus
                                pada pengadaan, instalasi, servis, dan
                                pendampingan teknis untuk rumah sakit, klinik,
                                dan fasilitas kesehatan di seluruh Indonesia
                                dengan izin edar resmi.
                            </p>

                            <div className="mt-5 flex items-center gap-2.5">
                                {settings.company_instagram && (
                                    <a
                                        href={settings.company_instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                        className="inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="size-5"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2m0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4zm4.5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6m5.25-2.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                        </svg>
                                    </a>
                                )}
                                {settings.company_facebook && (
                                    <a
                                        href={settings.company_facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                        className="inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="size-5"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
                                        </svg>
                                    </a>
                                )}
                                {settings.company_tiktok && (
                                    <a
                                        href={settings.company_tiktok}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="TikTok"
                                        className="inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="size-5"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.59 1.66-2.9 3.26-2.45V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" />
                                        </svg>
                                    </a>
                                )}
                                {settings.company_youtube && (
                                    <a
                                        href={settings.company_youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="YouTube"
                                        className="inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="size-5"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73" />
                                        </svg>
                                    </a>
                                )}
                                {settings.company_linkedin && (
                                    <a
                                        href={settings.company_linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                        className="inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="size-5"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>

                        <nav aria-label="Navigasi footer" className="lg:justify-self-end">
                            <h2 className="text-sm font-bold text-foreground">
                                Navigasi
                            </h2>
                            <ul className="mt-4 space-y-2.5">
                                <li>
                                    <Link
                                        href={home.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={about.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Tentang Kami
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={catalog.index.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        E-Catalogue
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={brands.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Brand Partner
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={legal.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Legalitas
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={gallery.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Galeri
                                    </Link>
                                </li>
                                {serviceEnabled && (
                                    <li>
                                        <Link
                                            href={service.index.url()}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            Layanan Servis
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link
                                        href={contact.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Kontak
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={`${home.url()}#faq`}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={privacy.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Kebijakan Privasi
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <nav aria-label="Produk footer" className="lg:justify-self-end">
                            <h2 className="text-sm font-bold text-foreground">
                                Produk & Layanan
                            </h2>
                            <ul className="mt-4 space-y-2.5">
                                <li>
                                    <Link
                                        href={catalog.index.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Katalog Alat Kesehatan
                                    </Link>
                                </li>
                                {serviceEnabled && (
                                    <li>
                                        <Link
                                            href={service.index.url()}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            Layanan Instalasi & Servis
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link
                                        href={quote.index.url()}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Daftar Penawaran
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <div className="lg:justify-self-end">
                            <h2 className="text-sm font-bold text-foreground">
                                Kontak
                            </h2>
                            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                                <li className="text-sm text-muted-foreground">
                                    Melayani pengiriman & instalasi ke seluruh
                                    Indonesia
                                </li>
                                {settings.company_address && (
                                    <li className="flex gap-2.5">
                                        <MapPin
                                            className="mt-0.5 size-4 shrink-0 text-primary"
                                            aria-hidden="true"
                                        />
                                        <span>{settings.company_address}</span>
                                    </li>
                                )}
                                {whatsappNumber && (
                                    <li className="flex gap-2.5">
                                        <MessageCircle
                                            className="mt-0.5 size-4 shrink-0 text-primary"
                                            aria-hidden="true"
                                        />
                                        <a
                                            href={whatsAppLink(
                                                whatsappNumber,
                                                defaultWhatsAppMessage,
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="tabular-nums transition-colors hover:text-foreground"
                                        >
                                            +62 {whatsappNumber.slice(2, 5)}-
                                            {whatsappNumber.slice(5, 9)}-
                                            {whatsappNumber.slice(9)}
                                        </a>
                                    </li>
                                )}
                                {settings.whatsapp_sales &&
                                    settings.whatsapp_sales !==
                                        whatsappNumber && (
                                        <li className="flex gap-2.5">
                                            <MessageCircle
                                                className="mt-0.5 size-4 shrink-0 text-primary"
                                                aria-hidden="true"
                                            />
                                            <a
                                                href={whatsAppLink(
                                                    settings.whatsapp_sales,
                                                    defaultWhatsAppMessage,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="tabular-nums transition-colors hover:text-foreground"
                                            >
                                                +62{' '}
                                                {settings.whatsapp_sales.slice(
                                                    2,
                                                    5,
                                                )}
                                                -
                                                {settings.whatsapp_sales.slice(
                                                    5,
                                                    9,
                                                )}
                                                -
                                                {settings.whatsapp_sales.slice(
                                                    9,
                                                )}
                                            </a>
                                        </li>
                                    )}
                                {settings.company_email && (
                                    <li className="flex gap-2.5">
                                        <Mail
                                            className="mt-0.5 size-4 shrink-0 text-primary"
                                            aria-hidden="true"
                                        />
                                        <a
                                            href={`mailto:${settings.company_email}`}
                                            className="transition-colors hover:text-foreground"
                                        >
                                            {settings.company_email}
                                        </a>
                                    </li>
                                )}
                                {settings.company_email_secondary && (
                                    <li className="flex gap-2.5">
                                        <Mail
                                            className="mt-0.5 size-4 shrink-0 text-primary"
                                            aria-hidden="true"
                                        />
                                        <a
                                            href={`mailto:${settings.company_email_secondary}`}
                                            className="transition-colors hover:text-foreground"
                                        >
                                            {settings.company_email_secondary}
                                        </a>
                                    </li>
                                )}
                                {settings.company_hours && (
                                    <li className="flex gap-2.5">
                                        <Clock
                                            className="mt-0.5 size-4 shrink-0 text-primary"
                                            aria-hidden="true"
                                        />
                                        <span>{settings.company_hours}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:mt-12">
                        <p>
                            ©{' '}
                            <span className="tabular-nums">
                                {new Date().getFullYear()}
                            </span>{' '}
                            {settings.company_name ??
                                'PT. Mandalika Global Alkesindo'}
                            .
                        </p>
                        <p>
                            Penawaran dan pembayaran diproses langsung bersama
                            tim kami.
                        </p>
                    </div>

                    {/* Developer metadata disimpan sebagai JSON-LD di <head>, bukan tampilan publik. */}
                </div>
            </footer>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationJsonLd),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        name: 'Muhamad Satria',
                        jobTitle:
                            'Full-Stack Web Development, Machine Learning, Automation, & AI Engineering',
                        url: 'https://muhamadsatria.my.id',
                        sameAs: [
                            'https://sardevstudio.my.id',
                            'https://muhamadsatria.my.id',
                        ],
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: 'Sukabumi',
                            addressRegion: 'Jawa Barat',
                            addressCountry: 'ID',
                        },
                        telephone: '+6285789483844',
                    }),
                }}
            />

            {whatsappNumber && <WhatsAppFloat number={whatsappNumber} />}
        </div>
    );
}
