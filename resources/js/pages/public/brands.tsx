import { Link } from '@inertiajs/react';
import Breadcrumb from '@/components/breadcrumb';
import Seo from '@/components/seo';
import { home } from '@/routes';
import type { SeoData } from '@/types/catalog';

type Brand = {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    url: string | null;
    status: 'principal_resmi' | 'tersedia' | string | null;
    short_description?: string | null;
};

type BrandsProps = {
    seo: SeoData;
    brands: Brand[];
};

export default function Brands({ seo, brands }: BrandsProps) {
    const principal = brands.filter(
        (brand) => brand.status === 'principal_resmi',
    );
    const others = brands.filter(
        (brand) => brand.status !== 'principal_resmi',
    );

    return (
        <>
            <Seo seo={seo} />

            <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Beranda', href: home.url() },
                        { label: 'Brand' },
                    ]}
                    className="mb-8"
                />

                <section className="mt-8">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Brand
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                        Daftar brand principal dan partner yang didistribusikan
                        oleh PT. Mandalika Global Alkesindo.
                    </p>
                </section>

                {principal.length > 0 && (
                    <section className="mt-12" aria-labelledby="principal-brands">
                        <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                            <h2
                                id="principal-brands"
                                className="text-2xl font-semibold tracking-tight"
                            >
                                Brand principal resmi
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {principal.length} brand
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {principal.map((brand) => (
                                <article
                                    key={brand.id}
                                    className="border border-border p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                                >
                                    {brand.logo ? (
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="h-12 w-auto object-contain"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold tracking-tight">
                                            {brand.name}
                                        </p>
                                    )}
                                    <span className="mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                                        Distributor Resmi
                                    </span>
                                    {brand.short_description && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {brand.short_description}
                                        </p>
                                    )}
                                    {brand.url && (
                                        <a
                                            href={brand.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-block text-sm font-semibold text-primary-strong underline-offset-4 hover:underline"
                                        >
                                            Kunjungi website
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {others.length > 0 && (
                    <section
                        className={principal.length > 0 ? 'mt-12' : 'mt-12'}
                        aria-labelledby="other-brands"
                    >
                        <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                            <h2
                                id="other-brands"
                                className="text-2xl font-semibold tracking-tight"
                            >
                                Brand tersedia
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {others.length} brand
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {others.map((brand) => (
                                <article
                                    key={brand.id}
                                    className="border border-border p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                                >
                                    {brand.logo ? (
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="h-12 w-auto object-contain"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold tracking-tight">
                                            {brand.name}
                                        </p>
                                    )}
                                    {brand.short_description && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {brand.short_description}
                                        </p>
                                    )}
                                    {brand.url && (
                                        <a
                                            href={brand.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-block text-sm font-semibold text-primary-strong underline-offset-4 hover:underline"
                                        >
                                            Kunjungi website
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {brands.length === 0 && (
                    <p className="mt-12 text-sm text-muted-foreground">
                        Daftar brand belum dipublikasikan.
                    </p>
                )}
            </div>
        </>
    );
}
