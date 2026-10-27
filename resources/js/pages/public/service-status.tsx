import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock,
    MapPin,
    MessageCircle,
    Search,
    ShieldCheck,
    Wrench,
} from 'lucide-react';
import { type FormEvent } from 'react';
import StatusBadge from '@/components/admin/status-badge';
import Seo from '@/components/seo';
import { formatDate, formatDateTime } from '@/lib/format';
import { whatsAppLink } from '@/lib/whatsapp';
import { home } from '@/routes';
import service from '@/routes/service';
import type { SeoData } from '@/types/catalog';
import type { SharedData } from '@/types';

type ServiceTicket = {
    code: string;
    status: string;
    equipment_name: string;
    brand: string | null;
    model: string | null;
    serial_number: string | null;
    preference: string;
    location: string | null;
    created_at: string | null;
    scheduled_at: string | null;
    completed_at: string | null;
    customer: {
        name: string;
        institution: string | null;
        city: string | null;
        phone_last4: string;
    };
    timeline: Array<{
        status: string;
        created_at: string | null;
    }>;
};

type ServiceStatusProps = {
    seo: SeoData;
    ticket: ServiceTicket | null;
    lookup: {
        code: string;
    };
};

type LookupForm = {
    code: string;
    phone4: string;
};

export default function ServiceStatusPage({
    seo,
    ticket,
    lookup,
}: ServiceStatusProps) {
    const { settings } = usePage<SharedData>().props;
    const whatsappNumber =
        settings.whatsapp_service ?? settings.whatsapp_number;

    const form = useForm<LookupForm>({
        code: lookup.code,
        phone4: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post(service.check.url(), { preserveScroll: true });
    };

    const whatsappUrl = whatsappNumber
        ? whatsAppLink(
              whatsappNumber,
              ticket
                  ? `Halo, saya ingin menanyakan tiket servis ${ticket.code} untuk ${ticket.equipment_name}.`
                  : 'Halo, saya ingin menanyakan status servis alat kesehatan.',
          )
        : null;

    return (
        <>
            <Seo seo={seo} noindex />

            <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-16 sm:px-6">
                <nav aria-label="Remah roti" className="text-xs">
                    <Link
                        href={service.index.url()}
                        className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                        Layanan servis
                    </Link>
                    <span className="mx-1.5 text-muted-foreground">/</span>
                    <span aria-current="page" className="text-foreground">
                        Cek status
                    </span>
                </nav>

                <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                    <div>
                        <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl">
                            Di mana posisi servis saya?
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                            Masukkan kode tiket dan 4 digit terakhir nomor
                            WhatsApp yang Anda gunakan saat mengajukan servis.
                            Status akan diperbarui setiap kali tim kami
                            memproses tiket.
                        </p>

                        <div className="mt-6 flex gap-3 border-l-2 border-primary pl-4">
                            <ShieldCheck
                                className="mt-0.5 size-4 shrink-0 text-primary"
                                aria-hidden="true"
                            />
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                Data hanya dapat dibuka dengan kombinasi kode
                                tiket dan nomor WhatsApp yang cocok. Halaman ini
                                tidak menampilkan catatan internal teknisi.
                            </p>
                        </div>

                        {whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
                            >
                                <MessageCircle
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                                Tetap butuh bantuan? Hubungi tim servis
                            </a>
                        )}
                    </div>

                    <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                        <div className="flex items-center gap-2">
                            <span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary-strong">
                                <Search className="size-4" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-base font-extrabold tracking-tight">
                                    Cek status servis
                                </h2>
                                <p className="font-mono text-xs text-muted-foreground">
                                    Kode tiket + 4 digit nomor WhatsApp
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="mt-5 space-y-4">
                            <div>
                                <label
                                    htmlFor="code"
                                    className="font-mono text-xs font-medium text-foreground"
                                >
                                    Kode tiket
                                </label>
                                <input
                                    id="code"
                                    className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 font-mono text-sm tracking-wider text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                                    value={form.data.code}
                                    onChange={(event) =>
                                        form.setData(
                                            'code',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    placeholder="SRV-2026-00045"
                                    autoComplete="off"
                                    spellCheck={false}
                                    required
                                />
                                {form.errors.code && (
                                    <p
                                        className="mt-1.5 text-xs font-medium text-destructive"
                                        role="alert"
                                    >
                                        {form.errors.code}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="phone4"
                                    className="font-mono text-xs font-medium text-foreground"
                                >
                                    4 digit terakhir nomor WhatsApp
                                </label>
                                <input
                                    id="phone4"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm tracking-[0.3em] text-foreground transition-colors outline-none placeholder:tracking-normal placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                                    value={form.data.phone4}
                                    onChange={(event) =>
                                        form.setData(
                                            'phone4',
                                            event.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 4),
                                        )
                                    }
                                    placeholder="7890"
                                    autoComplete="off"
                                    required
                                />
                                {form.errors.phone4 && (
                                    <p
                                        className="mt-1.5 text-xs font-medium text-destructive"
                                        role="alert"
                                    >
                                        {form.errors.phone4}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Search className="size-4" aria-hidden="true" />
                                {form.processing
                                    ? 'Memeriksa…'
                                    : 'Lihat status tiket'}
                            </button>
                        </form>

                        <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                            Kode tiket dikirim saat Anda mengajukan servis.
                            Hubungi kami bila kode tidak ditemukan.
                        </p>
                    </div>
                </div>

                {ticket && (
                    <section
                        aria-labelledby="hasil-status"
                        className="mt-12 scroll-mt-24 border-t border-border pt-10"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2
                                    id="hasil-status"
                                    className="flex flex-wrap items-center gap-3 text-2xl font-extrabold tracking-tight sm:text-3xl"
                                >
                                    <span className="font-mono text-xl sm:text-2xl">
                                        {ticket.code}
                                    </span>
                                    <StatusBadge status={ticket.status} />
                                </h2>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground">
                                Terakhir diperiksa{' '}
                                {formatDateTime(new Date().toISOString())}
                            </p>
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
                            <div className="rounded-lg border border-border bg-card p-5">
                                <div className="flex items-center gap-2">
                                    <ClipboardList
                                        className="size-4 text-primary"
                                        aria-hidden="true"
                                    />
                                    <h3 className="text-sm font-bold">
                                        Ringkasan tiket
                                    </h3>
                                </div>

                                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <dt className="font-mono text-xs text-muted-foreground">
                                            Alat
                                        </dt>
                                        <dd className="mt-0.5 font-bold">
                                            {ticket.equipment_name}
                                        </dd>
                                        <dd className="mt-0.5 font-mono text-xs text-muted-foreground">
                                            {[ticket.brand, ticket.model]
                                                .filter(Boolean)
                                                .join(' · ') ||
                                                'Brand/model belum dicatat'}
                                            {ticket.serial_number
                                                ? ` · SN ${ticket.serial_number}`
                                                : ''}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                                            <MapPin
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />
                                            Lokasi
                                        </dt>
                                        <dd className="mt-0.5 font-mono text-sm font-medium">
                                            {ticket.location ?? '-'}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                                            <Wrench
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />
                                            Preferensi
                                        </dt>
                                        <dd className="mt-0.5 font-mono text-sm font-medium">
                                            {ticket.preference}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                                            <CalendarDays
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />
                                            Diajukan
                                        </dt>
                                        <dd className="mt-0.5 font-mono text-sm font-medium">
                                            {formatDate(ticket.created_at)}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                                            <Clock
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />
                                            Dijadwalkan
                                        </dt>
                                        <dd className="mt-0.5 font-mono text-sm font-medium">
                                            {ticket.scheduled_at
                                                ? formatDateTime(
                                                      ticket.scheduled_at,
                                                  )
                                                : 'Belum dijadwalkan'}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-5 border-t border-border pt-4">
                                    <p className="font-mono text-xs text-muted-foreground">
                                        Pemohon
                                    </p>
                                    <p className="mt-0.5 text-sm font-bold">
                                        {ticket.customer.name}
                                    </p>
                                    <p className="font-mono text-xs text-muted-foreground">
                                        {ticket.customer.institution ??
                                            'Instansi belum dicatat'}
                                        {ticket.customer.city
                                            ? ` · ${ticket.customer.city}`
                                            : ''}
                                        {` · Nomor berakhir ${ticket.customer.phone_last4}`}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-border bg-card p-5">
                                <h3 className="text-sm font-bold">
                                    Perkembangan tiket
                                </h3>
                                <ol className="mt-4 space-y-0">
                                    {ticket.timeline.map((entry, index) => {
                                        const isLatest =
                                            index ===
                                            ticket.timeline.length - 1;

                                        return (
                                            <li
                                                key={`${entry.status}-${entry.created_at}-${index}`}
                                                className="relative flex gap-3 pb-5 last:pb-0"
                                            >
                                                {index <
                                                    ticket.timeline.length -
                                                        1 && (
                                                    <span
                                                        className="absolute top-5 left-[0.32rem] h-full w-px bg-border"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <span
                                                    className={
                                                        isLatest
                                                            ? 'mt-1 size-2.5 shrink-0 rounded-full bg-primary ring-4 ring-primary/15'
                                                            : 'mt-1 size-2.5 shrink-0 rounded-full bg-border'
                                                    }
                                                    aria-hidden="true"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-mono text-sm font-medium">
                                                        {entry.status}
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                                        {formatDateTime(
                                                            entry.created_at,
                                                        )}
                                                    </p>
                                                    {isLatest && (
                                                        <p className="mt-1 text-xs text-primary-strong">
                                                            Status saat ini
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>

                                {ticket.completed_at && (
                                    <p className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                                        <CheckCircle2
                                            className="mt-0.5 size-3.5 shrink-0 text-success"
                                            aria-hidden="true"
                                        />
                                        Tiket diselesaikan pada{' '}
                                        {formatDateTime(ticket.completed_at)}.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    <MessageCircle
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Tanyakan tiket ini
                                </a>
                            )}
                            <Link
                                href={service.index.url()}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary-strong"
                            >
                                <ArrowLeft
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Kembali ke layanan servis
                            </Link>
                        </div>
                    </section>
                )}

                {!ticket && (
                    <p className="mt-8 text-xs text-muted-foreground">
                        Belum punya tiket?{' '}
                        <Link
                            href={service.index.url()}
                            className="font-semibold text-foreground underline underline-offset-4"
                        >
                            Ajukan servis terlebih dahulu
                        </Link>
                        .
                    </p>
                )}

                <p className="mt-10 text-center text-xs text-muted-foreground">
                    <Link
                        href={home.url()}
                        className="underline underline-offset-4 hover:text-foreground"
                    >
                        Kembali ke beranda
                    </Link>
                </p>
            </div>
        </>
    );
}
