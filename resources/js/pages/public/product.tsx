import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronRight,
    FileText,
    Image as ImageIcon,
    MessageCircle,
    PackageCheck,
    ShieldCheck,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';
import ProductCard from '@/components/product-card';
import QuoteButton from '@/components/quote-button';
import Seo from '@/components/seo';
import { cn } from '@/lib/utils';
import { contact, home } from '@/routes';
import catalog from '@/routes/catalog';
import type { ProductCard as ProductCardType, SeoData } from '@/types/catalog';

type ProductDetail = {
    id: number;
    name: string;
    slug: string;
    model: string | null;
    sku: string | null;
    brand: string | null;
    brand_slug: string | null;
    category: string | null;
    category_slug: string | null;
    short_description: string | null;
    description: string | null;
    price: string | null;
    price_value: number | null;
    price_mode: string;
    stock_status: string;
    stock_label: string;
    is_published: boolean;
    images: string[];
    specs: Array<{ label: string | null; value: string }>;
    documents: Array<{ title: string; type: string; url: string }>;
    url: string;
};

type ProductPageProps = {
    product: ProductDetail;
    related: ProductCardType[];
    whatsappUrl: string | null;
    seo: SeoData;
    jsonLd: Record<string, unknown>;
};

const stockClass = (status: string): string => {
    if (status === 'Ready') {
        return 'border-success/30 bg-success/10 text-success';
    }

    if (status === 'Habis') {
        return 'border-destructive/30 bg-destructive/10 text-destructive';
    }

    return 'border-warning/40 bg-warning/10 text-warning';
};

const breadcrumbJsonLd = (product: ProductDetail): Record<string, unknown> => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Beranda',
            item: home.url(),
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'Katalog',
            item: catalog.index.url(),
        },
        {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: product.url,
        },
    ],
});

export default function Product({
    product,
    related,
    whatsappUrl,
    seo,
    jsonLd,
}: ProductPageProps) {
    const [activeImage, setActiveImage] = useState(0);
    const image = product.images[activeImage] ?? null;

    const quoteProduct: ProductCardType = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        model: product.model,
        sku: product.sku,
        brand: product.brand,
        category: product.category,
        price: product.price,
        price_value: product.price_value,
        price_mode: product.price_mode,
        stock_status: product.stock_status,
        stock_label: product.stock_label,
        image,
        url: product.url,
    };

    return (
        <>
            <Seo seo={seo} />

            <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6">
                <nav aria-label="Remah roti" className="font-mono text-xs">
                    <ol className="flex flex-wrap items-center gap-1.5">
                        <li>
                            <Link
                                href={home.url()}
                                className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                            >
                                Beranda
                            </Link>
                        </li>
                        <li aria-hidden="true">
                            <ChevronRight className="size-3 text-muted-foreground/60" />
                        </li>
                        <li>
                            <Link
                                href={catalog.index.url()}
                                className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                            >
                                Katalog
                            </Link>
                        </li>
                        {product.category_slug && (
                            <>
                                <li aria-hidden="true">
                                    <ChevronRight className="size-3 text-muted-foreground/60" />
                                </li>
                                <li>
                                    <Link
                                        href={catalog.index.url({
                                            query: {
                                                kategori: product.category_slug,
                                            },
                                        })}
                                        className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                                    >
                                        {product.category}
                                    </Link>
                                </li>
                            </>
                        )}
                        <li aria-hidden="true">
                            <ChevronRight className="size-3 text-muted-foreground/60" />
                        </li>
                        <li
                            className="max-w-[16rem] truncate font-semibold sm:max-w-md"
                            aria-current="page"
                        >
                            {product.name}
                        </li>
                    </ol>
                </nav>

                <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
                    <div>
                        <div className="overflow-hidden rounded-lg border border-border bg-secondary/50">
                            {image ? (
                                <img
                                    src={image}
                                    alt={`${product.name}${product.model ? ` ${product.model}` : ''}`}
                                    className="aspect-square w-full object-contain"
                                />
                            ) : (
                                <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 text-muted-foreground">
                                    <ImageIcon
                                        className="size-10"
                                        aria-hidden="true"
                                    />
                                    <p className="text-sm font-medium">
                                        Foto produk segera tersedia
                                    </p>
                                </div>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                {product.images.map((thumb, index) => (
                                    <button
                                        key={thumb}
                                        type="button"
                                        onClick={() => setActiveImage(index)}
                                        className={cn(
                                            'size-16 shrink-0 overflow-hidden rounded-md border bg-secondary/40 transition-colors',
                                            index === activeImage
                                                ? 'border-primary'
                                                : 'border-border hover:border-primary/40',
                                        )}
                                        aria-label={`Tampilkan foto ${index + 1}`}
                                        aria-pressed={index === activeImage}
                                    >
                                        <img
                                            src={thumb}
                                            alt=""
                                            className="size-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:py-1">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-xs">
                            <p className="font-medium text-primary-strong">
                                {product.brand ?? 'MGA Select'}
                            </p>
                            {product.category && (
                                <span className="text-muted-foreground">
                                    / {product.category}
                                </span>
                            )}
                        </div>

                        <h1 className="mt-3 text-3xl leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-4xl">
                            {product.name}
                        </h1>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground">
                            {product.model && (
                                <span>Model {product.model}</span>
                            )}
                            {product.sku && <span>SKU {product.sku}</span>}
                        </div>

                        {product.short_description && (
                            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                                {product.short_description}
                            </p>
                        )}

                        <div className="mt-6 rounded-lg border border-border bg-card p-4">
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Harga
                                    </p>
                                    <p className="mt-1 font-mono text-2xl font-extrabold tracking-tight tabular-nums">
                                        {product.price ?? 'Hubungi kami'}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Harga dapat menyesuaikan jumlah,
                                        pengiriman, dan kebutuhan instalasi.
                                    </p>
                                </div>

                                <span
                                    className={cn(
                                        'rounded-sm border px-2.5 py-1 font-mono text-xs font-medium',
                                        stockClass(product.stock_status),
                                    )}
                                >
                                    {product.stock_label}
                                </span>
                            </div>

                            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                                {whatsappUrl ? (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:flex-1"
                                    >
                                        <MessageCircle
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Tanya via WhatsApp
                                    </a>
                                ) : (
                                    <Link
                                        href={contact.url()}
                                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold hover:bg-secondary sm:flex-1"
                                    >
                                        Hubungi kami
                                    </Link>
                                )}

                                <QuoteButton
                                    product={quoteProduct}
                                    variant="outline"
                                    className="w-full sm:flex-1"
                                />
                            </div>
                        </div>

                        <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                            <li className="flex items-start gap-2.5">
                                <PackageCheck
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <span>Konsultasi kebutuhan & jumlah unit</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <ShieldCheck
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <span>Unit baru sesuai brand resmi</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Wrench
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <span>Dukungan teknis setelah pembelian</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MessageCircle
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <span>Penawaran resmi lewat WhatsApp</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                    <section aria-labelledby="deskripsi-produk">
                        <h2
                            id="deskripsi-produk"
                            className="text-lg font-extrabold tracking-tight"
                        >
                            Deskripsi
                        </h2>
                        <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            {product.description ? (
                                <p className="whitespace-pre-line">
                                    {product.description}
                                </p>
                            ) : (
                                <p>
                                    {product.short_description ??
                                        'Detail produk belum dilengkapi. Hubungi tim kami untuk informasi spesifikasi dan ketersediaan.'}
                                </p>
                            )}
                        </div>

                        {product.documents.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-sm font-bold">
                                    Dokumen produk
                                </h3>
                                <ul className="mt-3 space-y-2">
                                    {product.documents.map((document) => (
                                        <li key={document.url}>
                                            <a
                                                href={document.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                                            >
                                                <FileText
                                                    className="size-4 text-primary"
                                                    aria-hidden="true"
                                                />
                                                <span>{document.title}</span>
                                                <span className="font-mono text-xs font-medium text-muted-foreground">
                                                    {document.type}
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    <section aria-labelledby="spesifikasi-produk">
                        <h2
                            id="spesifikasi-produk"
                            className="text-lg font-extrabold tracking-tight"
                        >
                            Spesifikasi
                        </h2>
                        {product.specs.length > 0 ? (
                            <dl className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
                                {product.specs.map((spec, index) => (
                                    <div
                                        key={`${spec.label ?? 'spesifikasi'}-${index}`}
                                        className="grid gap-1 px-4 py-3 sm:grid-cols-[0.9fr_1.1fr] sm:gap-4"
                                    >
                                        <dt className="font-mono text-xs font-medium text-muted-foreground">
                                            {spec.label ?? 'Spesifikasi'}
                                        </dt>
                                        <dd className="font-mono text-sm font-medium whitespace-pre-line">
                                            {spec.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                                Rincian spesifikasi belum tersedia. Tim kami
                                dapat mengirimkan datasheet resmi lewat
                                WhatsApp.
                            </p>
                        )}
                    </section>
                </div>

                {related.length > 0 && (
                    <section className="mt-16" aria-labelledby="produk-terkait">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h2
                                    id="produk-terkait"
                                    className="text-lg font-extrabold tracking-tight"
                                >
                                    Produk terkait
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Pilihan lain dari kategori yang sama.
                                </p>
                            </div>
                            <Link
                                href={catalog.index.url({
                                    query: {
                                        kategori:
                                            product.category_slug ?? undefined,
                                    },
                                })}
                                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                            >
                                Lihat semua
                                <ChevronRight
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                            </Link>
                        </div>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-12">
                    <Link
                        href={catalog.index.url()}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        Kembali ke katalog
                    </Link>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd(product)),
                }}
            />
        </>
    );
}
