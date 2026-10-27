import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ClipboardList,
    MessageCircle,
    Minus,
    Plus,
    ShieldCheck,
    Trash2,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import Seo from '@/components/seo';
import TurnstileWidget from '@/components/turnstile-widget';
import {
    clearQuote,
    MAX_QUOTE_QTY,
    removeQuoteItem,
    setQuoteQty,
    useQuote,
} from '@/lib/quote';
import { getTracking } from '@/lib/tracking';
import { cn } from '@/lib/utils';
import { privacy } from '@/routes';
import catalog from '@/routes/catalog';
import quote from '@/routes/quote';
import type { SharedData } from '@/types';
import type { SeoData } from '@/types/catalog';

type QuotePageProps = {
    seo: SeoData;
};

type InquiryForm = {
    nama: string;
    instansi: string;
    kota: string;
    phone: string;
    email: string;
    catatan: string;
    consent: boolean;
    website: string;
    items: Array<{ product_id: number; qty: number }>;
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

export default function Quote({ seo }: QuotePageProps) {
    const items = useQuote();
    const { turnstileSiteKey } = usePage<SharedData>().props;
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const tracking = getTracking();

    const form = useForm<InquiryForm>({
        nama: '',
        instansi: '',
        kota: '',
        phone: '',
        email: '',
        catatan: '',
        consent: false,
        website: '',
        items: [],
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

    const totalQty = items.reduce((total, item) => total + item.qty, 0);

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (items.length === 0) {
            return;
        }

        form.transform((data) => ({
            ...data,
            items: items.map((item) => ({
                product_id: item.id,
                qty: item.qty,
            })),
            source_url: window.location.href,
            turnstile_token: turnstileToken,
        }));

        form.post(quote.store.url(), {
            preserveScroll: true,
            onSuccess: () => clearQuote(),
        });
    };

    return (
        <>
            <Seo seo={seo} />

            <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6">
                <nav aria-label="Remah roti" className="text-xs">
                    <Link
                        href={catalog.index.url()}
                        className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                        Katalog
                    </Link>
                    <span
                        className="mx-2 text-muted-foreground/60"
                        aria-hidden="true"
                    >
                        /
                    </span>
                    <span className="font-semibold">Daftar penawaran</span>
                </nav>

                <div className="mt-6 max-w-2xl">
                    <h1 className="text-3xl leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-4xl">
                        Daftar penawaran Anda
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Periksa produk dan jumlahnya, lalu lengkapi data agar
                        tim kami dapat menyiapkan penawaran resmi lewat
                        WhatsApp.
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="mt-10 flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-16 text-center">
                        <ClipboardList
                            className="size-9 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <h2 className="mt-4 text-lg font-bold">
                            Belum ada produk dipilih
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            Tambahkan produk dari katalog. Anda bisa memilih
                            beberapa alat sekaligus untuk satu permintaan
                            penawaran.
                        </p>
                        <Link
                            href={catalog.index.url()}
                            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                        >
                            Jelajahi katalog
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        <section aria-labelledby="produk-dipilih">
                            <div className="flex items-center justify-between gap-3">
                                <h2
                                    id="produk-dipilih"
                                    className="text-lg font-extrabold tracking-tight"
                                >
                                    Produk dipilih
                                </h2>
                                <p className="font-mono text-xs font-medium text-muted-foreground">
                                    {items.length} produk · {totalQty} unit
                                </p>
                            </div>

                            <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
                                {items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex gap-3 p-3 sm:gap-4 sm:p-4"
                                    >
                                        <Link
                                            href={item.url}
                                            className="size-16 shrink-0 overflow-hidden rounded-md border border-border bg-secondary/50 sm:size-20"
                                        >
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <span className="flex size-full items-center justify-center font-mono text-xs font-medium text-muted-foreground">
                                                    {item.brand ?? 'MGA'}
                                                </span>
                                            )}
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <p className="font-mono text-xs font-medium text-muted-foreground">
                                                {item.brand ?? 'MGA Select'}
                                            </p>
                                            <h3 className="mt-1 truncate text-sm font-bold">
                                                <Link
                                                    href={item.url}
                                                    className="hover:underline"
                                                >
                                                    {item.name}
                                                </Link>
                                            </h3>
                                            {item.model && (
                                                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                                    Model {item.model}
                                                </p>
                                            )}

                                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center rounded-md border border-border">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            item.qty <= 1
                                                                ? removeQuoteItem(
                                                                      item.id,
                                                                  )
                                                                : setQuoteQty(
                                                                      item.id,
                                                                      item.qty -
                                                                          1,
                                                                  )
                                                        }
                                                        className="grid size-8 place-items-center text-muted-foreground hover:text-foreground"
                                                        aria-label={`Kurangi jumlah ${item.name}`}
                                                    >
                                                        <Minus
                                                            className="size-3.5"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                    <span className="min-w-8 text-center font-mono text-sm font-medium tabular-nums">
                                                        {item.qty}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setQuoteQty(
                                                                item.id,
                                                                Math.min(
                                                                    MAX_QUOTE_QTY,
                                                                    item.qty +
                                                                        1,
                                                                ),
                                                            )
                                                        }
                                                        disabled={
                                                            item.qty >=
                                                            MAX_QUOTE_QTY
                                                        }
                                                        className="grid size-8 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                                                        aria-label={`Tambah jumlah ${item.name}`}
                                                    >
                                                        <Plus
                                                            className="size-3.5"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-xs font-medium">
                                                        {item.price ??
                                                            'Minta harga'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeQuoteItem(
                                                                item.id,
                                                            )
                                                        }
                                                        className="text-muted-foreground transition-colors hover:text-destructive"
                                                        aria-label={`Hapus ${item.name} dari daftar`}
                                                    >
                                                        <Trash2
                                                            className="size-4"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                <Link
                                    href={catalog.index.url()}
                                    className="inline-flex items-center gap-1.5 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Tambah produk lain
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                'Kosongkan seluruh daftar penawaran?',
                                            )
                                        ) {
                                            clearQuote();
                                        }
                                    }}
                                    className="py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive"
                                >
                                    Kosongkan daftar
                                </button>
                            </div>

                            <div className="mt-6 flex gap-3 rounded-lg border border-border bg-secondary/40 p-4">
                                <MessageCircle
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    Setelah form dikirim, WhatsApp akan terbuka
                                    dengan ringkasan permintaan dan kode
                                    penawaran. Simpan pesan tersebut sampai tim
                                    kami membalas.
                                </p>
                            </div>
                        </section>

                        <section
                            aria-labelledby="data-pemohon"
                            className="rounded-lg border border-border bg-card p-4 sm:p-5 lg:sticky lg:top-24"
                        >
                            <h2
                                id="data-pemohon"
                                className="text-lg font-extrabold tracking-tight"
                            >
                                Data pemohon
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Wajib diisi agar penawaran bisa kami proses.
                            </p>

                            <form onSubmit={submit} className="mt-5 space-y-4">
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

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="nama"
                                            className={labelClass}
                                        >
                                            Nama lengkap
                                        </label>
                                        <input
                                            id="nama"
                                            className={cn(inputClass, 'mt-1.5')}
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
                                            Nomor WhatsApp
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            inputMode="tel"
                                            className={cn(inputClass, 'mt-1.5')}
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
                                </div>

                                <div>
                                    <label
                                        htmlFor="instansi"
                                        className={labelClass}
                                    >
                                        Instansi / fasilitas kesehatan
                                    </label>
                                    <input
                                        id="instansi"
                                        className={cn(inputClass, 'mt-1.5')}
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

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="kota"
                                            className={labelClass}
                                        >
                                            Kota
                                        </label>
                                        <input
                                            id="kota"
                                            className={cn(inputClass, 'mt-1.5')}
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
                                            className={cn(inputClass, 'mt-1.5')}
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

                                <div>
                                    <label
                                        htmlFor="catatan"
                                        className={labelClass}
                                    >
                                        Catatan{' '}
                                        <span className="font-medium text-muted-foreground">
                                            (opsional)
                                        </span>
                                    </label>
                                    <textarea
                                        id="catatan"
                                        rows={3}
                                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                                        value={form.data.catatan}
                                        onChange={(event) =>
                                            form.setData(
                                                'catatan',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Kebutuhan khusus, target pengiriman, atau pertanyaan…"
                                    />
                                    <FieldError message={form.errors.catatan} />
                                </div>

                                <FieldError message={form.errors.items} />

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
                                        Saya setuju data ini digunakan untuk
                                        memproses permintaan penawaran dan
                                        dihubungi tim PT. Mandalika Global
                                        Alkesindo sesuai{' '}
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
                                    <TurnstileWidget
                                        siteKey={turnstileSiteKey}
                                        onToken={setTurnstileToken}
                                    />
                                )}

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <MessageCircle
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    {form.processing
                                        ? 'Memproses…'
                                        : 'Simpan & lanjut ke WhatsApp'}
                                </button>

                                <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                                    <ShieldCheck
                                        className="mt-0.5 size-3.5 shrink-0 text-primary"
                                        aria-hidden="true"
                                    />
                                    Nomor WhatsApp dipakai untuk menindaklanjuti
                                    permintaan. Kami tidak mengirim promosi
                                    tanpa persetujuan Anda.
                                </p>
                            </form>
                        </section>
                    </div>
                )}
            </div>
        </>
    );
}
