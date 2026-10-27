import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    CalendarClock,
    Camera,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    FileVideo,
    MessageCircle,
    PhoneCall,
    Search,
    ShieldCheck,
    Stethoscope,
    Truck,
    Upload,
    Wrench,
    X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import Seo from '@/components/seo';
import TurnstileWidget from '@/components/turnstile-widget';
import { whatsAppLink } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';
import { getTracking } from '@/lib/tracking';
import { home, privacy } from '@/routes';
import service from '@/routes/service';
import type { SeoData } from '@/types/catalog';
import type { SharedData } from '@/types';

type ServicePageProps = {
    seo: SeoData;
    preferences: Array<{ value: string; label: string }>;
};

type ServiceForm = {
    nama: string;
    instansi: string;
    kota: string;
    phone: string;
    email: string;
    equipment_name: string;
    brand: string;
    model: string;
    serial_number: string;
    issue: string;
    location: string;
    preference: string;
    media: File[];
    consent: boolean;
    website: string;
    turnstile_token: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    referrer: string | null;
    landing_url: string | null;
    source_url: string;
};

const inputClass =
    'h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30';

const labelClass = 'font-mono text-xs font-medium text-foreground';

const FieldError = ({ message }: { message?: string }) =>
    message ? (
        <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">
            {message}
        </p>
    ) : null;

const preferenceCopy: Record<
    string,
    { description: string; icon: typeof Truck }
> = {
    teknisi_datang: {
        description: 'Teknisi kami datang ke lokasi alat Anda.',
        icon: Truck,
    },
    kirim_alat: {
        description: 'Alat dikirim ke workshop kami untuk diperiksa.',
        icon: ClipboardCheck,
    },
    antar_sendiri: {
        description: 'Anda antar langsung ke lokasi kami di Mataram.',
        icon: Stethoscope,
    },
};

const scopeItems = [
    {
        title: 'Diagnosa & perbaikan',
        description:
            'Pemeriksaan menyeluruh, identifikasi penyebab, dan perbaikan unit yang bermasalah.',
        icon: Wrench,
    },
    {
        title: 'Perawatan berkala',
        description:
            'Pembersihan, pengecekan komponen, dan tindakan preventif agar alat tetap akurat.',
        icon: CalendarClock,
    },
    {
        title: 'Pengujian & instalasi',
        description:
            'Uji fungsi setelah perbaikan, pemasangan ulang, dan pendampingan penggunaan.',
        icon: BadgeCheck,
    },
];

const processSteps = [
    {
        title: 'Kirim detail alat',
        description:
            'Lengkapi data kontak, jenis alat, dan keluhan yang terjadi.',
    },
    {
        title: 'Tiket dibuat',
        description:
            'Sistem menerbitkan kode tiket dan meringkas kebutuhan Anda untuk tim.',
    },
    {
        title: 'Koordinasi teknis',
        description:
            'CS dan teknisi menghubungi Anda untuk jadwal, diagnosa, dan estimasi.',
    },
    {
        title: 'Pantau status',
        description:
            'Gunakan kode tiket dan 4 digit nomor WhatsApp untuk melihat progres.',
    },
];

export default function Service({ seo, preferences }: ServicePageProps) {
    const { settings, turnstileSiteKey } = usePage<SharedData>().props;
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const tracking = getTracking();
    const whatsappNumber =
        settings.whatsapp_service ?? settings.whatsapp_number;
    const whatsappUrl = whatsappNumber
        ? whatsAppLink(
              whatsappNumber,
              'Halo, saya ingin berkonsultasi tentang servis alat kesehatan.',
          )
        : null;

    const form = useForm<ServiceForm>({
        nama: '',
        instansi: '',
        kota: '',
        phone: '',
        email: '',
        equipment_name: '',
        brand: '',
        model: '',
        serial_number: '',
        issue: '',
        location: '',
        preference: 'teknisi_datang',
        media: [],
        consent: false,
        website: '',
        turnstile_token: null,
        utm_source: tracking.utm_source,
        utm_medium: tracking.utm_medium,
        utm_campaign: tracking.utm_campaign,
        utm_term: tracking.utm_term,
        utm_content: tracking.utm_content,
        referrer: tracking.referrer,
        landing_url: tracking.landing_url,
        source_url: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            source_url: window.location.href,
            turnstile_token: turnstileToken,
        }));

        form.post(service.store.url(), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const addFiles = (files: FileList | null): void => {
        if (!files) {
            return;
        }

        form.setData('media', [...form.data.media, ...Array.from(files)]);
    };

    const removeFile = (index: number): void => {
        form.setData(
            'media',
            form.data.media.filter((_, fileIndex) => fileIndex !== index),
        );
    };

    const serviceJsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Servis dan perbaikan alat kesehatan',
        serviceType: 'Perbaikan alat kesehatan',
        provider: {
            '@type': 'Organization',
            name: 'PT. Mandalika Global Alkesindo',
            url: home.url(),
        },
        areaServed: 'Indonesia',
        url: service.index.url(),
    };

    return (
        <>
            <Seo seo={seo} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(serviceJsonLd),
                }}
            />

            <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
                <nav aria-label="Remah roti" className="font-mono text-xs">
                    <Link
                        href={home.url()}
                        className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                        Beranda
                    </Link>
                    <span className="mx-1.5 text-muted-foreground">/</span>
                    <span aria-current="page" className="text-foreground">
                        Layanan servis
                    </span>
                </nav>

                <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div>
                        <h1 className="max-w-2xl text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl">
                            Alat kembali bekerja, layanan tetap berjalan.
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                            Sampaikan keluhan alat kesehatan Anda. Tim teknis
                            kami membantu diagnosa, perbaikan, dan perawatan
                            dengan alur tiket yang jelas dan bisa dipantau.
                        </p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="#form-servis"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Ajukan servis
                                <ArrowRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </a>
                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary-strong"
                                >
                                    <MessageCircle
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Tanya lewat WhatsApp
                                </a>
                            )}
                        </div>

                        <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-5">
                            <div>
                                <dt className="font-mono text-xs font-medium text-muted-foreground">
                                    Alur
                                </dt>
                                <dd className="mt-1 font-mono text-sm font-medium">
                                    Tiket tercatat
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-xs font-medium text-muted-foreground">
                                    Cakupan
                                </dt>
                                <dd className="mt-1 font-mono text-sm font-medium">
                                    Diagnosa–uji
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-xs font-medium text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="mt-1 font-mono text-sm font-medium">
                                    Bisa dipantau
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5">
                        <span className="absolute inset-x-0 top-0 h-1 bg-primary" />
                        <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary-strong">
                            <Search className="size-5" aria-hidden="true" />
                        </span>
                        <h2 className="mt-4 text-xl font-extrabold tracking-tight">
                            Sudah punya tiket?
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            Pantau progres servis dengan kode tiket dan 4 digit
                            terakhir nomor WhatsApp yang Anda daftarkan.
                        </p>

                        <div className="mt-4 border-t border-border pt-4">
                            <p className="font-mono text-xs font-medium text-muted-foreground">
                                Contoh kode tiket
                            </p>
                            <p className="mt-1 font-mono text-lg font-bold tracking-wider text-foreground">
                                SRV-2026-00045
                            </p>
                        </div>

                        <Link
                            href={service.status.url()}
                            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary-strong"
                        >
                            Cek status servis
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>

                        {whatsappNumber && (
                            <p className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                                <PhoneCall
                                    className="size-3.5 text-primary"
                                    aria-hidden="true"
                                />
                                Butuh dibantu? Hubungi {whatsappNumber}
                            </p>
                        )}
                    </div>
                </section>

                <section className="mt-16 border-t border-border pt-10">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                Dari keluhan kecil sampai uji fungsi.
                            </h2>
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                            Setiap tiket masuk ke alur yang sama: dicatat,
                            didiagnosa, dikerjakan, lalu diuji sebelum
                            diserahkan kembali.
                        </p>
                    </div>

                    <div className="mt-7 grid gap-6 sm:grid-cols-3">
                        {scopeItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="border-t border-border pt-5"
                                >
                                    <Icon
                                        className="size-5 text-primary"
                                        aria-hidden="true"
                                    />
                                    <h3 className="mt-4 text-base font-bold">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section
                    id="form-servis"
                    className="mt-16 scroll-mt-24 border-t border-border pt-10"
                >
                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div className="lg:sticky lg:top-24">
                            <h2 className="text-3xl font-extrabold tracking-tight">
                                Ceritakan kondisi alat Anda.
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                Semakin lengkap informasinya, semakin cepat tim
                                kami menentukan langkah berikutnya. Tidak ada
                                biaya untuk pengajuan awal.
                            </p>

                            <div className="mt-6 border-t border-border pt-5">
                                <h3 className="text-sm font-bold">
                                    Yang perlu disiapkan
                                </h3>
                                <ul className="mt-3 space-y-2.5">
                                    {[
                                        'Nama alat, brand, dan model bila ada.',
                                        'Keluhan atau gejala yang muncul.',
                                        'Foto atau video kondisi alat (opsional).',
                                        'Lokasi alat dan preferensi penanganan.',
                                    ].map((item) => (
                                        <li
                                            key={item}
                                            className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground"
                                        >
                                            <CheckCircle2
                                                className="mt-0.5 size-3.5 shrink-0 text-success"
                                                aria-hidden="true"
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4 flex gap-3 border-t border-border pt-4">
                                <Clock
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <div className="font-mono text-xs leading-relaxed text-muted-foreground">
                                    <p className="font-bold text-foreground">
                                        Jam layanan
                                    </p>
                                    <p className="mt-1">
                                        {settings.company_hours ??
                                            'Senin–Sabtu, 08.00–17.00 WITA.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
                            <form onSubmit={submit} className="space-y-7">
                                <div className="absolute -left-[9999px]">
                                    <label htmlFor="website">
                                        Website (jangan diisi)
                                    </label>
                                    <input
                                        id="website"
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={form.data.website}
                                        onChange={(event) =>
                                            form.setData(
                                                'website',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <fieldset>
                                    <legend className="font-mono text-sm font-bold tracking-tight">
                                        1. Data pemohon
                                    </legend>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Kami menggunakan data ini untuk
                                        mengonfirmasi tiket dan menjadwalkan
                                        tindakan.
                                    </p>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="nama"
                                                className={labelClass}
                                            >
                                                Nama lengkap{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="nama"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.nama}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'nama',
                                                        event.target.value,
                                                    )
                                                }
                                                autoComplete="name"
                                                required
                                            />
                                            <FieldError
                                                message={form.errors.nama}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className={labelClass}
                                            >
                                                Nomor WhatsApp{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                inputMode="tel"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.phone}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'phone',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="0812…"
                                                autoComplete="tel"
                                                required
                                            />
                                            <FieldError
                                                message={form.errors.phone}
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="instansi"
                                                className={labelClass}
                                            >
                                                Instansi / fasilitas kesehatan{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="instansi"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.instansi}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'instansi',
                                                        event.target.value,
                                                    )
                                                }
                                                autoComplete="organization"
                                                required
                                            />
                                            <FieldError
                                                message={form.errors.instansi}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="kota"
                                                className={labelClass}
                                            >
                                                Kota{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="kota"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.kota}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'kota',
                                                        event.target.value,
                                                    )
                                                }
                                                autoComplete="address-level2"
                                                required
                                            />
                                            <FieldError
                                                message={form.errors.kota}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className={labelClass}
                                            >
                                                Email{' '}
                                                <span className="font-medium text-muted-foreground">
                                                    (opsional)
                                                </span>
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.email}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'email',
                                                        event.target.value,
                                                    )
                                                }
                                                autoComplete="email"
                                            />
                                            <FieldError
                                                message={form.errors.email}
                                            />
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="border-t border-border pt-6">
                                    <legend className="font-mono text-sm font-bold tracking-tight">
                                        2. Detail alat
                                    </legend>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Data ini membantu teknisi menyiapkan
                                        alat dan suku cadang yang tepat.
                                    </p>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="equipment_name"
                                                className={labelClass}
                                            >
                                                Nama alat{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="equipment_name"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.equipment_name}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'equipment_name',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Patient Monitor"
                                                required
                                            />
                                            <FieldError
                                                message={
                                                    form.errors.equipment_name
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="brand"
                                                className={labelClass}
                                            >
                                                Brand{' '}
                                                <span className="font-medium text-muted-foreground">
                                                    (opsional)
                                                </span>
                                            </label>
                                            <input
                                                id="brand"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.brand}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'brand',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <FieldError
                                                message={form.errors.brand}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="model"
                                                className={labelClass}
                                            >
                                                Model{' '}
                                                <span className="font-medium text-muted-foreground">
                                                    (opsional)
                                                </span>
                                            </label>
                                            <input
                                                id="model"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.model}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'model',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <FieldError
                                                message={form.errors.model}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="serial_number"
                                                className={labelClass}
                                            >
                                                Nomor seri{' '}
                                                <span className="font-medium text-muted-foreground">
                                                    (opsional)
                                                </span>
                                            </label>
                                            <input
                                                id="serial_number"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.serial_number}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'serial_number',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <FieldError
                                                message={
                                                    form.errors.serial_number
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="location"
                                                className={labelClass}
                                            >
                                                Lokasi alat{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="location"
                                                className={cn(
                                                    inputClass,
                                                    'mt-1.5',
                                                )}
                                                value={form.data.location}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'location',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Ruang ICU, lantai 2…"
                                                required
                                            />
                                            <FieldError
                                                message={form.errors.location}
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="issue"
                                                className={labelClass}
                                            >
                                                Keluhan{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                id="issue"
                                                rows={4}
                                                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                                                value={form.data.issue}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'issue',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: layar menyala tetapi hasil pengukuran tidak muncul, alarm berbunyi terus…"
                                                required
                                            />
                                            <FieldError
                                                message={form.errors.issue}
                                            />
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="border-t border-border pt-6">
                                    <legend className="font-mono text-sm font-bold tracking-tight">
                                        3. Preferensi penanganan
                                    </legend>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Pilih cara yang paling sesuai. Tim kami
                                        akan mengonfirmasi ulang sebelum
                                        tindakan.
                                    </p>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        {preferences.map((preference) => {
                                            const copy = preferenceCopy[
                                                preference.value
                                            ] ?? {
                                                description:
                                                    'Tim kami akan menyesuaikan dengan kondisi Anda.',
                                                icon: Wrench,
                                            };
                                            const Icon = copy.icon;

                                            return (
                                                <label
                                                    key={preference.value}
                                                    className={cn(
                                                        'flex cursor-pointer flex-col rounded-md border p-3.5 transition-colors',
                                                        form.data.preference ===
                                                            preference.value
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-primary/40',
                                                    )}
                                                >
                                                    <span className="flex items-center justify-between gap-2">
                                                        <Icon
                                                            className="size-4 text-primary"
                                                            aria-hidden="true"
                                                        />
                                                        <input
                                                            type="radio"
                                                            name="preference"
                                                            value={
                                                                preference.value
                                                            }
                                                            checked={
                                                                form.data
                                                                    .preference ===
                                                                preference.value
                                                            }
                                                            onChange={() =>
                                                                form.setData(
                                                                    'preference',
                                                                    preference.value,
                                                                )
                                                            }
                                                            className="size-4 accent-primary"
                                                        />
                                                    </span>
                                                    <span className="mt-3 font-mono text-sm font-medium">
                                                        {preference.label}
                                                    </span>
                                                    <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                        {copy.description}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <FieldError
                                        message={form.errors.preference}
                                    />
                                </fieldset>

                                <fieldset className="border-t border-border pt-6">
                                    <legend className="font-mono text-sm font-bold tracking-tight">
                                        4. Foto atau video
                                    </legend>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Opsional, tetapi sangat membantu.
                                        Maksimal 3 berkas, 10 MB per berkas.
                                    </p>

                                    <label
                                        htmlFor="media"
                                        className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-secondary/30 px-4 py-6 text-center transition-colors hover:border-primary/40"
                                    >
                                        <span className="flex gap-2 text-primary">
                                            <Camera
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                            <FileVideo
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <span className="mt-3 flex items-center gap-1.5 text-sm font-bold">
                                            <Upload
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />
                                            Pilih foto atau video
                                        </span>
                                        <span className="mt-1 text-xs text-muted-foreground">
                                            JPG, PNG, WebP, MP4, MOV, atau WebM
                                        </span>
                                        <input
                                            id="media"
                                            type="file"
                                            multiple
                                            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                                            className="sr-only"
                                            onChange={(event) => {
                                                addFiles(event.target.files);
                                                event.target.value = '';
                                            }}
                                        />
                                    </label>

                                    {form.data.media.length > 0 && (
                                        <ul className="mt-3 space-y-2">
                                            {form.data.media.map(
                                                (file, index) => (
                                                    <li
                                                        key={`${file.name}-${index}`}
                                                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-xs"
                                                    >
                                                        <span className="truncate">
                                                            {file.name}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFile(
                                                                    index,
                                                                )
                                                            }
                                                            className="shrink-0 text-muted-foreground hover:text-destructive"
                                                            aria-label={`Hapus ${file.name}`}
                                                        >
                                                            <X
                                                                className="size-3.5"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                    <FieldError message={form.errors.media} />
                                </fieldset>

                                <div className="border-t border-border pt-6">
                                    <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
                                        <input
                                            type="checkbox"
                                            checked={form.data.consent}
                                            onChange={(event) =>
                                                form.setData(
                                                    'consent',
                                                    event.target.checked,
                                                )
                                            }
                                            className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary"
                                            required
                                        />
                                        <span>
                                            Saya setuju data dan lampiran ini
                                            digunakan untuk memproses permintaan
                                            servis dan dihubungi tim PT.
                                            Mandalika Global Alkesindo sesuai{' '}
                                            <Link
                                                href={privacy.url()}
                                                onClick={(event) =>
                                                    event.stopPropagation()
                                                }
                                                className="font-semibold text-foreground underline underline-offset-2"
                                            >
                                                kebijakan privasi
                                            </Link>
                                            .
                                        </span>
                                    </label>
                                    <FieldError message={form.errors.consent} />

                                    {turnstileSiteKey && (
                                        <div className="mt-4">
                                            <TurnstileWidget
                                                siteKey={turnstileSiteKey}
                                                onToken={setTurnstileToken}
                                            />
                                        </div>
                                    )}

                                    <FieldError
                                        message={form.errors.turnstile_token}
                                    />

                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <MessageCircle
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        {form.processing
                                            ? 'Membuat tiket…'
                                            : 'Kirim & buat tiket servis'}
                                    </button>

                                    {form.progress && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Mengunggah{' '}
                                            {form.progress.percentage}%
                                        </p>
                                    )}

                                    <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                                        <ShieldCheck
                                            className="mt-0.5 size-3.5 shrink-0 text-primary"
                                            aria-hidden="true"
                                        />
                                        Setelah dikirim, Anda akan menerima kode
                                        tiket dan WhatsApp akan terbuka dengan
                                        ringkasan permintaan.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="mt-16 border-t border-border pt-10">
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Empat langkah, tanpa status yang simpang siur.
                    </h2>

                    <ol className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {processSteps.map((step, index) => (
                            <li
                                key={step.title}
                                className="border-t border-border pt-5"
                            >
                                <span className="font-mono text-xs font-bold text-primary-strong">
                                    0{index + 1}
                                </span>
                                <h3 className="mt-3 text-sm font-bold">
                                    {step.title}
                                </h3>
                                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="mt-16 flex flex-col gap-5 rounded-lg border border-border bg-secondary/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight">
                            Butuh bicara langsung dengan tim?
                        </h2>
                        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            Untuk kasus mendesak atau alat yang sedang dipakai
                            pasien, hubungi kami lewat WhatsApp agar bisa
                            dikoordinasikan lebih cepat.
                        </p>
                    </div>
                    {whatsappUrl ? (
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <MessageCircle
                                className="size-4"
                                aria-hidden="true"
                            />
                            Hubungi tim servis
                        </a>
                    ) : (
                        <Link
                            href={privacy.url()}
                            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-bold"
                        >
                            Lihat kontak
                        </Link>
                    )}
                </section>
            </div>
        </>
    );
}
