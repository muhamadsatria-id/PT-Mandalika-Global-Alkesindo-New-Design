<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('q', ''));

        $customers = Customer::query()
            ->withCount(['inquiries', 'serviceRequests'])
            ->when($search !== '', function (Builder $query) use ($search): void {
                $like = '%'.$search.'%';

                $query->where(function (Builder $query) use ($like): void {
                    $query->where('name', 'like', $like)
                        ->orWhere('phone', 'like', $like)
                        ->orWhere('institution', 'like', $like)
                        ->orWhere('city', 'like', $like)
                        ->orWhere('email', 'like', $like);
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $customers->through(fn (Customer $customer): array => [
            'id' => $customer->id,
            'name' => $customer->name,
            'institution' => $customer->institution,
            'city' => $customer->city,
            'phone' => $customer->phone,
            'email' => $customer->email,
            'inquiries_count' => $customer->inquiries_count,
            'services_count' => $customer->service_requests_count,
            'created_at' => $customer->created_at?->toIso8601String(),
        ]);

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => ['q' => $search],
            'stats' => [
                'total' => Customer::query()->count(),
                'withInquiries' => Customer::query()->whereHas('inquiries')->count(),
            ],
        ]);
    }

    public function show(Customer $customer): Response
    {
        $customer->load([
            'inquiries' => fn ($query) => $query->withCount('items')->latest(),
            'serviceRequests' => fn ($query) => $query->latest(),
        ]);

        return Inertia::render('admin/customers/show', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'institution' => $customer->institution,
                'city' => $customer->city,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'notes' => $customer->notes,
                'tags' => $customer->tags ?? [],
                'created_at' => $customer->created_at?->toIso8601String(),
            ],
            'inquiries' => $customer->inquiries->map(fn ($inquiry): array => [
                'id' => $inquiry->id,
                'code' => $inquiry->code,
                'status' => $inquiry->status->value,
                'items_count' => $inquiry->items_count,
                'deal_value' => $inquiry->deal_value,
                'created_at' => $inquiry->created_at?->toIso8601String(),
            ])->all(),
            'services' => $customer->serviceRequests->map(fn ($service): array => [
                'id' => $service->id,
                'code' => $service->code,
                'device' => $service->equipment_name,
                'status' => $service->status->value,
                'created_at' => $service->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }
}
