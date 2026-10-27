<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyStat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyStatController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/company-stats/index', [
            'stats' => CompanyStat::query()
                ->orderBy('sort_order')
                ->orderBy('label')
                ->get()
                ->map(fn (CompanyStat $stat): array => [
                    'id' => $stat->id,
                    'label' => $stat->label,
                    'value' => $stat->value,
                    'is_published' => $stat->is_published,
                    'sort_order' => $stat->sort_order,
                ])
                ->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/company-stats/form', ['stat' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'min:2', 'max:120'],
            'value' => ['required', 'string', 'max:50'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $stat = CompanyStat::query()->create([
            'label' => $validated['label'],
            'value' => $validated['value'],
            'is_published' => $request->boolean('is_published', true),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.company-stats.index')
            ->with('success', 'Statistik "'.$stat->label.'" ditambahkan.');
    }

    public function edit(CompanyStat $companyStat): Response
    {
        return Inertia::render('admin/company-stats/form', [
            'stat' => [
                'id' => $companyStat->id,
                'label' => $companyStat->label,
                'value' => $companyStat->value,
                'is_published' => $companyStat->is_published,
                'sort_order' => $companyStat->sort_order,
            ],
        ]);
    }

    public function update(Request $request, CompanyStat $companyStat): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'min:2', 'max:120'],
            'value' => ['required', 'string', 'max:50'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $companyStat->update([
            'label' => $validated['label'],
            'value' => $validated['value'],
            'is_published' => $request->boolean('is_published'),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.company-stats.index')
            ->with('success', 'Statistik "'.$companyStat->label.'" diperbarui.');
    }

    public function destroy(CompanyStat $companyStat): RedirectResponse
    {
        $label = $companyStat->label;
        $companyStat->delete();

        return redirect()
            ->route('admin.company-stats.index')
            ->with('success', 'Statistik "'.$label.'" dihapus.');
    }
}
