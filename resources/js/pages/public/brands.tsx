import { Link } from '@inertiajs/react';
import Seo from '@/components/seo';
import { home } from '@/routes';
import type { SeoData } from '@/types/catalog';

type Brand = {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    url: string | null;
};

type BrandsProps = {
    seo: SeoData;
    brands: Brand[];
};

export default function Brands({ seo, brands }: BrandsProps) {
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
                        Brands
                    </span>
                </nav>

                <section className="mt-8">
                    <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl">
                        Brand principal dan mitra resmi.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                        Daftar brand principal yang didistribusikan oleh PT.
                        Mandalika Global Alkesindo.
                    </p>
                </section>

                <section className="mt-12" aria-labelledby="brands">
                    <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                        <h2
                            id="brands"
                            className="text-2xl font-extrabold tracking-tight"
                        >
                            Mitra principal
                        </h2>
                        <p className="font-mono text-xs text-muted-foreground">
                            {brands.length} brand
                        </p>
                    </div>

                    {brands.length === 0 ? (
                        <p className="mt-8 text-sm text-muted-foreground">
                            Daftar brand belum dipublikasikan.
                        </p>
                    ) : (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {brands.map((brand) => (
                                <article
                                    key={brand.id}
                                    className="border-t border-border pt-5"
                                >
                                    {brand.logo ? (
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="h-12 w-auto object-contain"
                                        />
                                    ) : (
                                        <p className="font-mono text-lg font-extrabold tracking-tight">
                                            {brand.name}
                                        </p>
                                    )}
                                    {brand.url && (
                                        <a
                                            href={brand.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-block text-sm font-semibold text-primary-strong underline-offset-4 hover:underline"
                                        >
                                            Kunjungi
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
