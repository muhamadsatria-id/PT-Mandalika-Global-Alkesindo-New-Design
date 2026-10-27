import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    ClipboardList,
    Copy,
    MessageCircle,
    Search,
    Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Seo from '@/components/seo';
import { formatDate } from '@/lib/format';
import { home } from '@/routes';
import service from '@/routes/service';
import type { SeoData } from '@/types/catalog';

type ServiceSentProps = {
    ticket: {
        code: string;
        equipment_name: string;
        customer_name: string;
        institution: string | null;
        preference: string;
        created_at: string | null;
    };
    whatsappUrl: string | null;
    seo: SeoData;
};

export default function ServiceSent({
    ticket,
    whatsappUrl,
    seo,
}: ServiceSentProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!whatsappUrl) {
            return;
        }

        const timeout = window.setTimeout(() => {
            window.location.assign(whatsappUrl);
        }, 1200);

        return () => window.clearTimeout(timeout);
    }, [whatsappUrl]);

    const copyCode = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(ticket.code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <>
            <Seo seo={seo} noindex />

            <div className="mx-auto w-full max-w-3xl px-4 pt-10 pb-16 sm:px-6">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-8">
                    <div className="flex items-start gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                            <CheckCircle2
                                className="size-5"
                                aria-hidden="true"
                            />
                        </span>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                Permintaan servis Anda sudah tercatat.
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Simpan kode tiket di bawah. Tim kami akan
                                menghubungi Anda lewat WhatsApp untuk
                                mengonfirmasi langkah berikutnya.
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-mono text-xs font-medium text-muted-foreground">
                                Kode tiket
                            </p>
                            <p className="mt-1 font-mono text-2xl font-extrabold tracking-wider text-foreground">
                                {ticket.code}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={copyCode}
                            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-xs font-bold transition-colors hover:border-primary/40 hover:text-primary-strong"
                        >
                            <Copy className="size-3.5" aria-hidden="true" />
                            {copied ? 'Tersalin' : 'Salin kode'}
                        </button>
                    </div>

                    <div className="mt-6 border-t border-border pt-4">
                        <div className="flex items-center gap-2">
                            <ClipboardList
                                className="size-4 text-primary"
                                aria-hidden="true"
                            />
                            <h2 className="text-sm font-bold">
                                Ringkasan permintaan
                            </h2>
                        </div>

                        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="font-mono text-xs text-muted-foreground">
                                    Pemohon
                                </dt>
                                <dd className="mt-0.5 font-semibold">
                                    {ticket.customer_name}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-xs text-muted-foreground">
                                    Instansi
                                </dt>
                                <dd className="mt-0.5 font-semibold">
                                    {ticket.institution ?? '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-xs text-muted-foreground">
                                    Alat
                                </dt>
                                <dd className="mt-0.5 font-semibold">
                                    {ticket.equipment_name}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-xs text-muted-foreground">
                                    Preferensi
                                </dt>
                                <dd className="mt-0.5 font-mono text-sm font-medium">
                                    {ticket.preference}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-xs text-muted-foreground">
                                    Tanggal pengajuan
                                </dt>
                                <dd className="mt-0.5 font-mono text-sm font-medium">
                                    {formatDate(ticket.created_at)}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {whatsappUrl ? (
                        <div className="mt-6">
                            <a
                                href={whatsappUrl}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                            >
                                <MessageCircle
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Buka WhatsApp sekarang
                            </a>
                            <p className="mt-2 text-xs text-muted-foreground">
                                WhatsApp akan terbuka otomatis. Bila tidak,
                                gunakan tombol di atas.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 border-l-2 border-warning/60 pl-4 text-sm">
                            Nomor WhatsApp tim servis belum diatur. Tiket Anda
                            sudah tersimpan; tim akan menghubungi melalui data
                            yang dikirim.
                        </div>
                    )}

                    <div className="mt-8 grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
                        <Link
                            href={service.status.url()}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary-strong"
                        >
                            <Search className="size-4" aria-hidden="true" />
                            Cek status tiket
                        </Link>
                        <Link
                            href={service.index.url()}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary-strong"
                        >
                            <Wrench className="size-4" aria-hidden="true" />
                            Ajukan servis lain
                        </Link>
                    </div>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        <Link
                            href={home.url()}
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            Kembali ke beranda
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
