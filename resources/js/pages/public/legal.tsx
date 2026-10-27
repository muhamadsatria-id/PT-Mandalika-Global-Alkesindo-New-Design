import { Link } from '@inertiajs/react';
import Breadcrumb from '@/components/breadcrumb';
import Seo from '@/components/seo';
import { home } from '@/routes';
import type { SeoData } from '@/types/catalog';

type LegalDocument = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    notes: string | null;
    file: string;
    type: string;
    group: string | null;
    issued_by: string | null;
    issued_at: string | null;
    expires_at: string | null;
    is_expired: boolean;
    expires_in_days: number | null;
};

type LegalProps = {
    seo: SeoData;
    documents: LegalDocument[];
};

const typeLabels: Record<string, string> = {
    sertifikat: 'Sertifikat',
    izin_edar: 'Izin Edar',
    nib: 'NIB',
    akl: 'AKL',
    iso: 'ISO',
    lainnya: 'Dokumen',
};

const groupOrder = ['Perusahaan', 'Izin Usaha', 'Alat Kesehatan', 'Lainnya'];

export default function Legal({ seo, documents }: LegalProps) {
    const grouped = documents.reduce<Record<string, LegalDocument[]>>(
        (acc, doc) => {
            const key = doc.group || 'Lainnya';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(doc);
            return acc;
        },
        {},
    );

    const groups = Object.keys(grouped).sort((a, b) => {
        const ai = groupOrder.indexOf(a);
        const bi = groupOrder.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });

    return (
        <>
            <Seo seo={seo} />

            <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Beranda', href: home.url() },
                        { label: 'Legalitas' },
                    ]}
                    className="mb-8"
                />

                <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-start">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Legalitas
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                            Dokumen legalitas PT. Mandalika Global Alkesindo untuk
                            kebutuhan tender, pengadaan pemerintah, kemitraan,
                            dan verifikasi alat kesehatan.
                        </p>
                    </div>

                    <div className="border-l-2 border-primary pl-5 text-sm leading-relaxed text-muted-foreground">
                        <p className="font-semibold text-foreground">
                            Komitmen kepatuhan
                        </p>
                        <p className="mt-2">
                            Kami menjunjung tinggi kepatuhan perizinan dan
                            ketertelusuran produk. Dokumen disediakan untuk
                            verifikasi administrasi. Untuk kebutuhan tender atau
                            dokumen tambahan, silakan hubungi tim kami.
                        </p>
                        <p className="mt-2">
                            Khusus terkait <span className="font-semibold text-foreground">AKL</span>{' '}
                            (Angka Klasifikasi Lokasi), dokumen ini berkaitan
                            dengan klasifikasi kegiatan usaha distribusi alat
                            kesehatan sesuai perizinan yang berlaku.
                        </p>
                    </div>
                </section>

                {documents.length === 0 ? (
                    <section className="mt-12">
                        <p className="text-sm text-muted-foreground">
                            Dokumen legalitas belum dipublikasikan.
                        </p>
                    </section>
                ) : (
                    <div className="mt-12 space-y-12">
                        {groups.map((group) => (
                            <section key={group} aria-labelledby={`group-${group}`}>
                                <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                                    <h2
                                        id={`group-${group}`}
                                        className="text-2xl font-semibold tracking-tight"
                                    >
                                        {group}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {grouped[group].length} dokumen
                                    </p>
                                </div>

                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {grouped[group].map((document) => (
                                        <article
                                            key={document.id}
                                            className="border border-border p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    {typeLabels[document.type] ??
                                                        'Dokumen'}
                                                </p>
                                                {document.is_expired && (
                                                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-700">
                                                        Kedaluwarsa
                                                    </span>
                                                )}
                                                {!document.is_expired &&
                                                    document.expires_at &&
                                                    document.expires_in_days !==
                                                        null &&
                                                    document.expires_in_days <=
                                                        90 && (
                                                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                                                            Hampir kedaluwarsa
                                                        </span>
                                                    )}
                                            </div>
                                            <h3 className="mt-2 text-base font-semibold">
                                                {document.title}
                                            </h3>
                                            {(document.description ||
                                                document.notes) && (
                                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                    {document.description ||
                                                        document.notes}
                                                </p>
                                            )}
                                            <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
                                                {document.issued_by && (
                                                    <div>
                                                        <dt className="font-medium">
                                                            Penerbit
                                                        </dt>
                                                        <dd>
                                                            {document.issued_by}
                                                        </dd>
                                                    </div>
                                                )}
                                                {document.issued_at && (
                                                    <div>
                                                        <dt className="font-medium">
                                                            Tanggal terbit
                                                        </dt>
                                                        <dd>
                                                            {document.issued_at}
                                                        </dd>
                                                    </div>
                                                )}
                                                {document.expires_at && (
                                                    <div>
                                                        <dt className="font-medium">
                                                            Berlaku hingga
                                                        </dt>
                                                        <dd>
                                                            {document.expires_at}
                                                        </dd>
                                                    </div>
                                                )}
                                            </dl>
                                            <a
                                                href={document.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-strong underline-offset-4 hover:underline"
                                            >
                                                Buka dokumen
                                            </a>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
