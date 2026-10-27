<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\LegalDocument;
use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function __invoke(): Response
    {
        $documents = LegalDocument::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get()
            ->map(fn (LegalDocument $document): array => [
                'id' => $document->id,
                'title' => $document->title,
                'slug' => $document->slug,
                'description' => $document->description,
                'file' => $document->file,
                'type' => $document->type,
                'issued_by' => $document->issued_by,
                'issued_at' => $document->issued_at?->toDateString(),
            ])
            ->all();

        return Inertia::render('public/legal', [
            'seo' => [
                'title' => 'Legalitas perusahaan',
                'description' => 'Dokumen, sertifikasi, dan legalitas PT. Mandalika Global Alkesindo untuk kebutuhan tender dan kemitraan.',
                'canonical' => route('legal'),
            ],
            'documents' => $documents,
        ]);
    }
}
