import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    ClipboardList,
    MessageCircle,
    RotateCcw,
} from 'lucide-react';
import { useEffect } from 'react';
import Seo from '@/components/seo';
import { home } from '@/routes';
import catalog from '@/routes/catalog';
import type { SeoData } from '@/types/catalog';

type QuoteSentProps = {
    inquiry: {
        code: string;
        customer_name: string;
        institution: string | null;
        city: string | null;
        notes: string | null;
        items: Array<{ name: string; brand: string | null; qty: number }>;
    };
    whatsappUrl: string | null;
    seo: SeoData;
};

export default function QuoteSent({
    inquiry,
    whatsappUrl,
    seo,
}: QuoteSentProps) {
    useEffect(() => {
        if (!whatsappUrl) {
            return;
        }

        const timeout = window.setTimeout(() => {
            window.location.assign(whatsappUrl);
        }, 1200);

        return () => window.clearTimeout(timeout);
    }, [whatsappUrl]);

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
                                Penawaran Anda sedang disiapkan.
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Kode permintaan{' '}
                                <span className="font-mono font-medium text-foreground">
                                    {inquiry.code}
                                </span>
                                . Simpan kode ini untuk memudahkan tindak
                                lanjut.
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 border-y border-border py-4">
                        <div className="flex items-center gap-2">
                            <ClipboardList
                                className="size-4 text-primary"
                                aria-hidden="true"
                            />
                            <h2 className="text-sm font-bold">
                                Ringkasan permintaan
                            </h2>
                        </div>
                        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="font-mono text-xs text-muted-foreground">
                                    Pemohon
                                </dt>
                                <dd className="font-mono text-sm font-medium">
                                    {inquiry.customer_name}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-xs text-muted-foreground">
                                    Instansi
                                </dt>
                                <dd className="font-mono text-sm font-medium">
                                    {inquiry.institution ?? '-'}
                                </dd>
                            </div>
                        </dl>

                        <ul className="mt-4 divide-y divide-border border-t border-border">
                            {inquiry.items.map((item, index) => (
                                <li
                                    key={`${item.name}-${index}`}
                                    className="flex items-start justify-between gap-4 py-2.5 text-sm"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {item.name}
                                        </p>
                                        <p className="font-mono text-xs text-muted-foreground">
                                            {item.brand ?? '-'}
                                        </p>
                                    </div>
                                    <span className="shrink-0 rounded-sm bg-secondary px-2 py-0.5 font-mono text-xs font-medium">
                                        {item.qty} unit
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {inquiry.notes && (
                            <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                                Catatan: {inquiry.notes}
                            </p>
                        )}
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
                            Nomor WhatsApp CS belum diatur. Permintaan Anda
                            sudah tersimpan; tim akan menghubungi melalui data
                            yang dikirim.
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href={home.url()}
                            className="font-semibold text-muted-foreground hover:text-foreground"
                        >
                            Kembali ke beranda
                        </Link>
                        <Link
                            href={catalog.index.url()}
                            className="inline-flex items-center gap-1.5 font-semibold text-primary-strong hover:underline"
                        >
                            <RotateCcw
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Mulai daftar penawaran baru
                        </Link>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                    Tim kami akan membalas pada jam kerja. Untuk kebutuhan
                    mendesak, hubungi nomor WhatsApp resmi yang tertera di
                    halaman kontak.
                </p>
            </div>
        </>
    );
}
