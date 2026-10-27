<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/testimonials/index', [
            'testimonials' => Testimonial::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (Testimonial $testimonial): array => [
                    'id' => $testimonial->id,
                    'name' => $testimonial->name,
                    'role' => $testimonial->role,
                    'institution' => $testimonial->institution,
                    'quote' => $testimonial->quote,
                    'avatar' => $testimonial->avatar,
                    'rating' => $testimonial->rating,
                    'is_published' => $testimonial->is_published,
                    'sort_order' => $testimonial->sort_order,
                ])
                ->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/testimonials/form', ['testimonial' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'role' => ['nullable', 'string', 'max:120'],
            'institution' => ['nullable', 'string', 'max:150'],
            'quote' => ['required', 'string', 'min:5', 'max:2000'],
            'avatar' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $avatar = $request->hasFile('avatar')
            ? '/storage/'.$request->file('avatar')->store('testimonials', 'public')
            : null;

        $testimonial = Testimonial::query()->create([
            'name' => $validated['name'],
            'role' => $validated['role'] ?? null,
            'institution' => $validated['institution'] ?? null,
            'quote' => $validated['quote'],
            'avatar' => $avatar,
            'rating' => $request->integer('rating', 5),
            'is_published' => $request->boolean('is_published', true),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimoni "'.$testimonial->name.'" ditambahkan.');
    }

    public function edit(Testimonial $testimonial): Response
    {
        return Inertia::render('admin/testimonials/form', [
            'testimonial' => [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'role' => $testimonial->role,
                'institution' => $testimonial->institution,
                'quote' => $testimonial->quote,
                'avatar' => $testimonial->avatar,
                'rating' => $testimonial->rating,
                'is_published' => $testimonial->is_published,
                'sort_order' => $testimonial->sort_order,
            ],
        ]);
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'role' => ['nullable', 'string', 'max:120'],
            'institution' => ['nullable', 'string', 'max:150'],
            'quote' => ['required', 'string', 'min:5', 'max:2000'],
            'avatar' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $data = [
            'name' => $validated['name'],
            'role' => $validated['role'] ?? null,
            'institution' => $validated['institution'] ?? null,
            'quote' => $validated['quote'],
            'rating' => $request->integer('rating', $testimonial->rating),
            'is_published' => $request->boolean('is_published'),
            'sort_order' => $request->integer('sort_order'),
        ];

        if ($request->hasFile('avatar')) {
            $data['avatar'] = '/storage/'.$request->file('avatar')->store('testimonials', 'public');
        }

        $testimonial->update($data);

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimoni "'.$testimonial->name.'" diperbarui.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $name = $testimonial->name;
        $testimonial->delete();

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimoni "'.$name.'" dihapus.');
    }
}
