import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Breadcrumb from '@/components/breadcrumb';
import Seo from '@/components/seo';
import { home } from '@/routes';
import type { SeoData } from '@/types/catalog';

type GalleryCategory = {
    id: number;
    name: string;
    slug: string;
};

type GalleryItem = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    file: string;
    type: string;
    alt: string | null;
    category: string | null;
    category_slug: string | null;
};

type GalleryProps = {
    seo: SeoData;
    categories: GalleryCategory[];
    items: GalleryItem[];
};

export default function Gallery({ seo, categories, items }: GalleryProps) {
    const [active, setActive] = useState<string | null>(null);

    const filtered = useMemo(
        () =>
            active
                ? items.filter((item) => item.category_slug === active)
                : items,
        [active, items],
    );

    return (
        <>
            <Seo seo={seo} />

            <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Beranda', href: home.url() },
                        { label: 'Galeri' },
                    ]}
                    className="mb-8"
                />

                <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-start">
                    <div>
                        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
                            Dokumentasi kegiatan dan instalasi.
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                            Foto dan video kegiatan instalasi, pameran,
                            pelatihan, serta dokumentasi gudang PT. Mandalika
                            Global Alkesindo.
                        </p>
                    </div>

                    <div className="border-l-2 border-primary pl-5 text-sm leading-relaxed text-muted-foreground">
                        <p className="font-semibold text-foreground">
                            Ingin melihat langsung?
                        </p>
                        <p className="mt-2">
                            Jadwalkan demo produk atau kunjungan ke fasilitas
                            kami melalui tim penjualan.
                        </p>
                    </div>
                </section>

                <section className="mt-8" aria-label="Filter galeri">
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActive(null)}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${
                                active === null
                                    ? 'text-foreground underline underline-offset-4'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Semua
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setActive(category.slug)}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                    active === category.slug
                                        ? 'text-foreground underline underline-offset-4'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mt-8" aria-labelledby="galeri">
                    <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                        <h2
                            id="galeri"
                            className="text-2xl font-semibold tracking-tight"
                        >
                            Dokumentasi
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {filtered.length} dari {items.length}
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <p className="mt-8 text-sm text-muted-foreground">
                            Belum ada dokumentasi untuk kategori ini.
                        </p>
                    ) : (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((item) => (
                                <article
                                    key={item.id}
                                    className="border-t border-border pt-5"
                                >
                                    <div className="aspect-[4/3] overflow-hidden rounded-md border border-border bg-secondary/40">
                                        {item.type === 'video' ? (
                                            <video
                                                src={item.file}
                                                controls
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={item.file}
                                                alt={item.alt ?? item.title}
                                                className="size-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <h3 className="mt-3 text-base font-semibold">
                                        {item.title}
                                    </h3>
                                    {item.description && (
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {item.description}
                                        </p>
                                    )}
                                    {item.category && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {item.category}
                                        </p>
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
