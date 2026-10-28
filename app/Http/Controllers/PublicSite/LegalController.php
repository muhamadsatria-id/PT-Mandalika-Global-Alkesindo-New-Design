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
            ->orderByRaw('CASE WHEN `group` IS NULL THEN 1 ELSE 0 END')
            ->orderBy('group')
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get()
            ->map(fn (LegalDocument $document): array => [
                'id' => $document->id,
                'title' => $document->title,
                'slug' => $document->slug,
                'description' => $document->description,
                'notes' => $document->notes,
                'file' => $document->file,
                'type' => $document->type,
                'group' => $document->group,
                'issued_by' => $document->issued_by,
                'issued_at' => $document->issued_at?->toDateString(),
                'expires_at' => $document->expires_at?->toDateString(),
                'is_expired' => $document->expires_at ? $document->expires_at->isPast() : false,
                'expires_in_days' => $document->expires_at ? ($document->expires_at->isPast() ? 0 : now()->diffInDays($document->expires_at)) : null,
            ])
            ->all();

        return Inertia::render('public/legal', [
            'seo' => [
                'title' => 'Legalitas & Izin Alkes',
                'description' => 'Dokumen legalitas, izin edar, NIB, dan sertifikasi PT. Mandalika Global Alkesindo untuk kebutuhan tender dan verifikasi.',
                'canonical' => route('legal'),
            ],
            'documents' => $documents,
        ]);
    }
}
