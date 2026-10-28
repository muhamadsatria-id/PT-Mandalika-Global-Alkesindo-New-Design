import { Head, usePage } from '@inertiajs/react';
import type { SeoData } from '@/types/catalog';
import type { SharedData } from '@/types';

type SeoProps = {
    seo: SeoData;
    noindex?: boolean;
};

function absoluteUrl(value: string | null | undefined): string | undefined {
    if (!value) {
        return undefined;
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    if (typeof window === 'undefined') {
        return value;
    }

    return new URL(value, window.location.origin).toString();
}

export default function Seo({ seo, noindex = false }: SeoProps) {
    const { settings, name } = usePage<SharedData>().props;
    const image = absoluteUrl(settings.site_logo) ?? absoluteUrl('/mga.png');

    return (
        <Head title={seo.title}>
            <meta
                head-key="description"
                name="description"
                content={seo.description ?? undefined}
            />
            <meta
                head-key="robots"
                name="robots"
                content={noindex ? 'noindex,nofollow' : 'index,follow'}
            />
            <meta head-key="og:type" property="og:type" content="website" />
            <meta
                head-key="og:site_name"
                property="og:site_name"
                content={name}
            />
            <meta head-key="og:title" property="og:title" content={seo.title} />
            <meta
                head-key="og:description"
                property="og:description"
                content={seo.description ?? undefined}
            />
            <meta head-key="og:url" property="og:url" content={seo.canonical} />
            <meta head-key="og:image" property="og:image" content={image} />
            <meta head-key="og:locale" property="og:locale" content="id_ID" />
            <meta
                head-key="twitter:card"
                name="twitter:card"
                content="summary_large_image"
            />
            <meta
                head-key="twitter:title"
                name="twitter:title"
                content={seo.title}
            />
            <meta
                head-key="twitter:description"
                name="twitter:description"
                content={seo.description ?? undefined}
            />
            <meta
                head-key="twitter:image"
                name="twitter:image"
                content={image}
            />
            {seo.canonical && (
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={seo.canonical}
                />
            )}
        </Head>
    );
}
