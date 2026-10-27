<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LegalDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LegalDocumentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/legal-documents/index', [
            'documents' => LegalDocument::query()
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
                    'is_published' => $document->is_published,
                    'sort_order' => $document->sort_order,
                ])
                ->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/legal-documents/form', ['document' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:2', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'type' => ['required', 'string', 'max:50'],
            'issued_by' => ['nullable', 'string', 'max:150'],
            'issued_at' => ['nullable', 'date'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $file = $request->file('file')->store('legal', 'public');

        $document = LegalDocument::query()->create([
            'title' => $validated['title'],
            'slug' => $this->uniqueSlug($validated['title']),
            'description' => $validated['description'] ?? null,
            'file' => '/storage/'.$file,
            'type' => $validated['type'],
            'issued_by' => $validated['issued_by'] ?? null,
            'issued_at' => $validated['issued_at'] ?? null,
            'is_published' => $request->boolean('is_published', true),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.legal-documents.index')
            ->with('success', 'Dokumen "'.$document->title.'" ditambahkan.');
    }

    public function edit(LegalDocument $legalDocument): Response
    {
        return Inertia::render('admin/legal-documents/form', [
            'document' => [
                'id' => $legalDocument->id,
                'title' => $legalDocument->title,
                'slug' => $legalDocument->slug,
                'description' => $legalDocument->description,
                'file' => $legalDocument->file,
                'type' => $legalDocument->type,
                'issued_by' => $legalDocument->issued_by,
                'issued_at' => $legalDocument->issued_at?->toDateString(),
                'is_published' => $legalDocument->is_published,
                'sort_order' => $legalDocument->sort_order,
            ],
        ]);
    }

    public function update(Request $request, LegalDocument $legalDocument): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:2', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'type' => ['required', 'string', 'max:50'],
            'issued_by' => ['nullable', 'string', 'max:150'],
            'issued_at' => ['nullable', 'date'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'issued_by' => $validated['issued_by'] ?? null,
            'issued_at' => $validated['issued_at'] ?? null,
            'is_published' => $request->boolean('is_published'),
            'sort_order' => $request->integer('sort_order'),
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file')->store('legal', 'public');
            $data['file'] = '/storage/'.$file;
        }

        $legalDocument->update($data);

        return redirect()
            ->route('admin.legal-documents.index')
            ->with('success', 'Dokumen "'.$legalDocument->title.'" diperbarui.');
    }

    public function destroy(LegalDocument $legalDocument): RedirectResponse
    {
        $name = $legalDocument->title;
        $legalDocument->delete();

        return redirect()
            ->route('admin.legal-documents.index')
            ->with('success', 'Dokumen "'.$name.'" dihapus.');
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $counter = 2;

        while (LegalDocument::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
