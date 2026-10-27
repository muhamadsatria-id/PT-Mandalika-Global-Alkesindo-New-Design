import { Head } from '@inertiajs/react';
import type { SeoData } from '@/types/catalog';

type SeoProps = {
    seo: SeoData;
    noindex?: boolean;
};

export default function Seo({ seo, noindex = false }: SeoProps) {
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
            <meta head-key="og:title" property="og:title" content={seo.title} />
            <meta
                head-key="og:description"
                property="og:description"
                content={seo.description ?? undefined}
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
