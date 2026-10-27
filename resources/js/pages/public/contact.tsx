import { Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Navigation,
    Wrench,
} from 'lucide-react';
import Seo from '@/components/seo';
import { defaultWhatsAppMessage, whatsAppLink } from '@/lib/whatsapp';
import { home } from '@/routes';
import type { SharedData } from '@/types';
import type { SeoData } from '@/types/catalog';

type ContactProps = {
    seo: SeoData;
    contact: {
        address: string | null;
        city: string | null;
        hours: string | null;
        email: string | null;
        instagram: string | null;
        map_url: string | null;
    };
};

export default function Contact({ seo, contact }: ContactProps) {
    const { settings } = usePage<SharedData>().props;
    const whatsappNumber = settings.whatsapp_number;
    const salesLink = whatsappNumber
        ? whatsAppLink(
              whatsappNumber,
              'Halo PT. Mandalika Global Alkesindo, saya ingin berkonsultasi tentang kebutuhan alat kesehatan.',
          )
        : null;
    const serviceLink = whatsappNumber
        ? whatsAppLink(
              whatsappNumber,
              'Halo PT. Mandalika Global Alkesindo, saya ingin menanyakan layanan servis alat kesehatan.',
          )
        : null;

    const city = contact.city;
    const cityIsInAddress =
        city !== null &&
        Boolean(contact.address?.toLowerCase().includes(city.toLowerCase()));
    const location = [contact.address, cityIsInAddress ? null : city]
        .filter((part): part is string => Boolean(part))
        .join(', ');

    return (
        <>
            <Seo seo={seo} />

            <section className="border-b border-border bg-secondary/30">
                <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-12 sm:px-6 lg:pt-16 lg:pb-16">
                    <h1 className="max-w-2xl text-4xl leading-[0.98] font-extrabold tracking-[-0.035em] sm:text-5xl">
                        Langsung bicara dengan tim yang menangani.
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                        Untuk penawaran alat, jadwal servis, atau pertanyaan
                        teknis, hubungi kami melalui WhatsApp. Kami balas pada
                        jam kerja.
                    </p>

                    <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                        {salesLink && (
                            <a
                                href={salesLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                            >
                                <MessageCircle
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                WhatsApp penjualan
                            </a>
                        )}
                        {serviceLink && (
                            <a
                                href={serviceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-5 text-sm font-semibold hover:bg-secondary"
                            >
                                <Wrench className="size-4" aria-hidden="true" />
                                WhatsApp servis
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-lg border border-border bg-card p-5 sm:p-7">
                        <h2 className="text-lg font-extrabold tracking-tight">
                            Informasi kontak
                        </h2>
                        <dl className="mt-6 space-y-6">
                            <div className="flex gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary-strong">
                                    <MapPin
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </span>
                                <div>
                                    <dt className="font-mono text-xs font-medium text-muted-foreground">
                                        Alamat
                                    </dt>
                                    <dd className="mt-1 font-mono text-sm leading-relaxed">
                                        {location || 'Alamat belum diatur.'}
                                    </dd>
                                    {contact.map_url && (
                                        <a
                                            href={contact.map_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center gap-1 py-1 font-mono text-xs font-medium text-primary-strong hover:underline"
                                        >
                                            Buka di Google Maps
                                            <ArrowUpRight
                                                className="size-3"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary-strong">
                                    <Clock
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </span>
                                <div>
                                    <dt className="font-mono text-xs font-medium text-muted-foreground">
                                        Jam operasional
                                    </dt>
                                    <dd className="mt-1 font-mono text-sm leading-relaxed">
                                        {contact.hours ??
                                            'Jam operasional belum diatur.'}
                                    </dd>
                                </div>
                            </div>

                            {contact.email && (
                                <div className="flex gap-3">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary-strong">
                                        <Mail
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <div>
                                        <dt className="font-mono text-xs font-medium text-muted-foreground">
                                            Email
                                        </dt>
                                        <dd className="mt-1 font-mono text-sm">
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="font-medium hover:underline"
                                            >
                                                {contact.email}
                                            </a>
                                        </dd>
                                    </div>
                                </div>
                            )}

                            {whatsappNumber && (
                                <div className="flex gap-3">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary-strong">
                                        <MessageCircle
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <div>
                                        <dt className="font-mono text-xs font-medium text-muted-foreground">
                                            WhatsApp
                                        </dt>
                                        <dd className="mt-1 font-mono text-sm tabular-nums">
                                            <a
                                                href={whatsAppLink(
                                                    whatsappNumber,
                                                    defaultWhatsAppMessage,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium hover:underline"
                                            >
                                                {whatsappNumber}
                                            </a>
                                        </dd>
                                    </div>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="rounded-lg border border-border bg-secondary/40 p-5 sm:p-6">
                            <h2 className="text-lg font-extrabold tracking-tight">
                                Butuh servis alat?
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Sampaikan jenis alat, brand, dan keluhan yang
                                muncul. Tim akan membantu menentukan langkah
                                pengecekan berikutnya.
                            </p>
                            <Link
                                href={`${home.url()}#layanan`}
                                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary-strong"
                            >
                                Lihat alur layanan
                                <ArrowUpRight
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                            </Link>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                            <h2 className="text-sm font-bold">
                                Sebelum menghubungi
                            </h2>
                            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                                <li>
                                    Sertakan nama instansi dan kota untuk
                                    mempercepat pengecekan.
                                </li>
                                <li>
                                    Untuk penawaran, sebutkan jumlah unit yang
                                    diperkirakan.
                                </li>
                                <li>
                                    Untuk servis, sertakan model dan nomor seri
                                    bila tersedia.
                                </li>
                            </ul>
                        </div>

                        {contact.map_url && (
                            <a
                                href={contact.map_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border text-sm font-semibold hover:bg-secondary"
                            >
                                <Navigation
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Petunjuk arah
                            </a>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
