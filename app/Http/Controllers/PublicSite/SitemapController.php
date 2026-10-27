<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = [
            ['loc' => route('home'), 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => route('catalog.index'), 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => route('service.index'), 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => route('about'), 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => route('brands'), 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => route('legal'), 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => route('gallery'), 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => route('contact'), 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => route('quote.index'), 'changefreq' => 'monthly', 'priority' => '0.4'],
            ['loc' => route('privacy'), 'changefreq' => 'yearly', 'priority' => '0.3'],
        ];

        Product::query()
            ->published()
            ->with('category:id,slug')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->each(function (Product $product) use (&$urls): void {
                if ($product->category === null) {
                    return;
                }

                $urls[] = [
                    'loc' => route('catalog.show', [
                        'category' => $product->category->slug,
                        'product' => $product->slug,
                    ]),
                    'lastmod' => $product->updated_at?->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.8',
                ];
            });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($urls as $url) {
            $xml .= '    <url>'."\n";
            $xml .= '        <loc>'.htmlspecialchars($url['loc'], ENT_XML1).'</loc>'."\n";

            if (isset($url['lastmod'])) {
                $xml .= '        <lastmod>'.$url['lastmod'].'</lastmod>'."\n";
            }

            $xml .= '        <changefreq>'.$url['changefreq'].'</changefreq>'."\n";
            $xml .= '        <priority>'.$url['priority'].'</priority>'."\n";
            $xml .= '    </url>'."\n";
        }

        $xml .= '</urlset>'."\n";

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}
