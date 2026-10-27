import { Link } from '@inertiajs/react';
import Seo from '@/components/seo';
import { home } from '@/routes';
import type { SeoData } from '@/types/catalog';

type LegalDocument = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    file: string;
    type: string;
    issued_by: string | null;
    issued_at: string | null;
};

type LegalProps = {
    seo: SeoData;
    documents: LegalDocument[];
};

const typeLabels: Record<string, string> = {
    sertifikat: 'Sertifikat',
    izin_edar: 'Izin edar',
    nib: 'NIB',
    iso: 'ISO',
    lainnya: 'Dokumen',
};

export default function Legal({ seo, documents }: LegalProps) {
    return (
        <>
            <Seo seo={seo} />

            <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6">
                <nav aria-label="Remah roti" className="font-mono text-xs">
                    <Link
                        href={home.url()}
                        className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                        Beranda
                    </Link>
                    <span className="mx-1.5 text-muted-foreground">/</span>
                    <span aria-current="page" className="text-foreground">
                        Legalitas
                    </span>
                </nav>

                <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-start">
                    <div>
                        <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl">
                            Dokumen dan sertifikasi perusahaan.
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                            Legalitas PT. Mandalika Global Alkesindo untuk
                            kebutuhan tender, kemitraan, dan verifikasi produk
                            alat kesehatan.
                        </p>
                    </div>

                    <div className="border-l-2 border-primary pl-5 text-sm leading-relaxed text-muted-foreground">
                        <p className="font-bold text-foreground">
                            Komitmen kepatuhan
                        </p>
                        <p className="mt-2">
                            Dokumen disediakan untuk verifikasi legal dan
                            administrasi pengadaan. Untuk kebutuhan tender atau
                            dokumen tambahan, hubungi tim kami.
                        </p>
                    </div>
                </section>

                <section className="mt-12" aria-labelledby="dokumen">
                    <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                        <h2
                            id="dokumen"
                            className="text-2xl font-extrabold tracking-tight"
                        >
                            Dokumen tersedia
                        </h2>
                        <p className="font-mono text-xs text-muted-foreground">
                            {documents.length} dokumen
                        </p>
                    </div>

                    {documents.length === 0 ? (
                        <p className="mt-8 text-sm text-muted-foreground">
                            Dokumen legalitas belum dipublikasikan.
                        </p>
                    ) : (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {documents.map((document) => (
                                <article
                                    key={document.id}
                                    className="border-t border-border pt-5"
                                >
                                    <p className="font-mono text-xs font-medium text-muted-foreground">
                                        {typeLabels[document.type] ?? 'Dokumen'}
                                    </p>
                                    <h3 className="mt-2 text-base font-bold">
                                        {document.title}
                                    </h3>
                                    {document.description && (
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {document.description}
                                        </p>
                                    )}
                                    <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
                                        {document.issued_by && (
                                            <div>
                                                <dt className="font-mono font-medium">
                                                    Penerbit
                                                </dt>
                                                <dd>{document.issued_by}</dd>
                                            </div>
                                        )}
                                        {document.issued_at && (
                                            <div>
                                                <dt className="font-mono font-medium">
                                                    Tanggal
                                                </dt>
                                                <dd className="font-mono">
                                                    {document.issued_at}
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
                    )}
                </section>
            </div>
        </>
    );
}
