<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PriceMode;
use App\Enums\StockStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('q', ''));
        $status = (string) $request->query('status', '');
        $categoryId = $request->integer('kategori');
        $brandId = $request->integer('brand');

        $products = Product::query()
            ->with(['brand:id,name', 'category:id,name', 'media'])
            ->when($search !== '', function (Builder $query) use ($search): void {
                $like = '%'.$search.'%';

                $query->where(function (Builder $query) use ($like): void {
                    $query->where('name', 'like', $like)
                        ->orWhere('model', 'like', $like)
                        ->orWhere('sku', 'like', $like);
                });
            })
            ->when($status === 'published', fn (Builder $query) => $query->where('is_published', true))
            ->when($status === 'draft', fn (Builder $query) => $query->where('is_published', false))
            ->when($categoryId > 0, fn (Builder $query) => $query->where('category_id', $categoryId))
            ->when($brandId > 0, fn (Builder $query) => $query->where('brand_id', $brandId))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $products->through(fn (Product $product): array => [
            'id' => $product->id,
            'name' => $product->name,
            'model' => $product->model,
            'sku' => $product->sku,
            'slug' => $product->slug,
            'category' => $product->category?->name,
            'brand' => $product->brand?->name,
            'price' => $product->displayPrice(),
            'price_mode' => $product->price_mode->value,
            'stock_status' => $product->stock_status->value,
            'stock_label' => $product->stock_status->label(),
            'is_published' => $product->is_published,
            'is_featured' => $product->is_featured,
            'image' => $this->mediaUrl(
                $product->media->isEmpty() ? null : $product->media->first()->path,
            ),
            'updated_at' => $product->updated_at?->toIso8601String(),
        ]);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'filters' => [
                'q' => $search,
                'status' => $status,
                'kategori' => $categoryId > 0 ? $categoryId : null,
                'brand' => $brandId > 0 ? $brandId : null,
            ],
            'categories' => Category::query()->orderBy('sort_order')->orderBy('name')->get(['id', 'name'])->all(),
            'brands' => Brand::query()->orderBy('name')->get(['id', 'name'])->all(),
            'stats' => [
                'total' => Product::query()->count(),
                'published' => Product::query()->where('is_published', true)->count(),
                'draft' => Product::query()->where('is_published', false)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            ...$this->formOptions(),
            'product' => null,
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $product = Product::query()->create([
            ...collect($data)->except([
                'specs',
                'media',
                'documents',
                'is_featured',
                'is_published',
                'removed_media',
                'removed_documents',
                'primary_media_id',
            ])->all(),
            'is_featured' => $request->boolean('is_featured'),
            'is_published' => $request->boolean('is_published'),
            'price' => $data['price_mode'] === PriceMode::Contact->value ? null : ($data['price'] ?? null),
        ]);

        $this->syncSpecs($product, $data['specs'] ?? []);
        $this->storeMedia($product, $request->file('media', []));
        $this->storeDocuments($product, $request->file('documents', []));

        return redirect()
            ->route('admin.products.edit', $product)
            ->with('success', 'Produk "'.$product->name.'" berhasil ditambahkan.');
    }

    public function show(Product $product): RedirectResponse
    {
        return redirect()->route('admin.products.edit', $product);
    }

    public function edit(Product $product): Response
    {
        $product->load(['specs', 'media', 'documents', 'brand:id,name', 'category:id,name']);

        return Inertia::render('admin/products/form', [
            ...$this->formOptions(),
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'model' => $product->model,
                'sku' => $product->sku,
                'slug' => $product->slug,
                'category_id' => $product->category_id,
                'brand_id' => $product->brand_id,
                'short_description' => $product->short_description,
                'description' => $product->description,
                'price' => $product->price,
                'price_mode' => $product->price_mode->value,
                'stock_status' => $product->stock_status->value,
                'is_featured' => $product->is_featured,
                'is_published' => $product->is_published,
                'seo_title' => $product->seo_title,
                'seo_description' => $product->seo_description,
                'specs' => $product->specs->map(fn ($spec): array => [
                    'id' => $spec->id,
                    'label' => $spec->label,
                    'value' => $spec->value,
                ])->all(),
                'media' => $product->media->map(fn ($media): array => [
                    'id' => $media->id,
                    'url' => $this->mediaUrl($media->path),
                    'alt' => $media->alt,
                    'is_primary' => $media->is_primary,
                ])->all(),
                'documents' => $product->documents->map(fn ($document): array => [
                    'id' => $document->id,
                    'title' => $document->title,
                    'type' => $document->type,
                    'url' => $this->mediaUrl($document->file),
                ])->all(),
            ],
        ]);
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();
        $removedMediaIds = $data['removed_media'] ?? [];
        $removedMedia = array_map(
            static fn ($id): int => (int) $id,
            is_array($removedMediaIds) ? array_values($removedMediaIds) : [],
        );
        $newMedia = $request->file('media', []);

        $remainingMedia = $product->media()->whereNotIn('id', $removedMedia)->count();

        if ($remainingMedia + count($newMedia) > 5) {
            throw ValidationException::withMessages([
                'media' => 'Maksimal 5 foto per produk. Hapus foto lama terlebih dahulu.',
            ]);
        }

        $product->update([
            ...collect($data)->except([
                'specs',
                'media',
                'documents',
                'is_featured',
                'is_published',
                'removed_media',
                'removed_documents',
                'primary_media_id',
            ])->all(),
            'is_featured' => $request->boolean('is_featured'),
            'is_published' => $request->boolean('is_published'),
            'price' => $data['price_mode'] === PriceMode::Contact->value ? null : ($data['price'] ?? null),
        ]);

        $this->syncSpecs($product, $data['specs'] ?? []);
        $this->removeMedia($product, $removedMedia);
        $this->storeMedia($product, $newMedia);
        $this->removeDocuments($product, $data['removed_documents'] ?? []);
        $this->storeDocuments($product, $request->file('documents', []));
        $this->syncPrimaryMedia($product, $data['primary_media_id'] ?? null);

        return redirect()
            ->route('admin.products.edit', $product)
            ->with('success', 'Perubahan produk "'.$product->name.'" disimpan.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $name = $product->name;
        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Produk "'.$name.'" dipindahkan ke arsip.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'categories' => Category::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->all(),
            'brands' => Brand::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->all(),
            'priceModes' => collect(PriceMode::cases())
                ->map(fn (PriceMode $mode): array => ['value' => $mode->value, 'label' => $mode->label()])
                ->all(),
            'stockStatuses' => collect(StockStatus::cases())
                ->map(fn (StockStatus $status): array => ['value' => $status->value, 'label' => $status->label()])
                ->all(),
        ];
    }

    /**
     * @param  array<int, array{label?: string|null, value?: string|null}>  $specs
     */
    private function syncSpecs(Product $product, array $specs): void
    {
        $product->specs()->delete();

        $sortOrder = 0;

        foreach ($specs as $spec) {
            $value = trim((string) ($spec['value'] ?? ''));

            if ($value === '') {
                continue;
            }

            $label = trim((string) ($spec['label'] ?? ''));

            $product->specs()->create([
                'label' => $label !== '' ? $label : null,
                'value' => $value,
                'sort_order' => $sortOrder++,
            ]);
        }
    }

    /**
     * @param  array<int, UploadedFile>|UploadedFile  $files
     */
    private function storeMedia(Product $product, array|UploadedFile $files): void
    {
        $files = is_array($files) ? $files : [$files];

        $hasPrimary = $product->media()->where('is_primary', true)->exists();
        $sortOrder = (int) $product->media()->max('sort_order');

        foreach (array_values($files) as $index => $file) {
            if ($product->media()->count() >= 5) {
                break;
            }

            $path = $file->store('products/'.$product->id, 'public');

            if ($path === false || $path === '') {
                continue;
            }

            $product->media()->create([
                'path' => $path,
                'alt' => $product->name,
                'is_primary' => ! $hasPrimary && $index === 0,
                'sort_order' => ++$sortOrder,
            ]);
        }
    }

    /**
     * @param  array<int, int>  $ids
     */
    private function removeMedia(Product $product, array $ids): void
    {
        if ($ids === []) {
            return;
        }

        $media = $product->media()->whereIn('id', $ids)->get();

        foreach ($media as $item) {
            Storage::disk('public')->delete($item->path);
            $item->delete();
        }
    }

    private function syncPrimaryMedia(Product $product, ?int $primaryId): void
    {
        $media = $product->media()->orderBy('sort_order')->get();

        if ($media->isEmpty()) {
            return;
        }

        $primary = $primaryId !== null
            ? $media->firstWhere('id', $primaryId)
            : ($media->firstWhere('is_primary', true) ?? $media->first());

        $product->media()->update(['is_primary' => false]);

        $primary?->update(['is_primary' => true]);
    }

    /**
     * @param  array<int, UploadedFile>|UploadedFile  $files
     */
    private function storeDocuments(Product $product, array|UploadedFile $files): void
    {
        $files = is_array($files) ? $files : [$files];

        $sortOrder = (int) $product->documents()->max('sort_order');

        foreach (array_values($files) as $file) {
            if ($product->documents()->count() >= 5) {
                break;
            }

            $path = $file->store('product-documents/'.$product->id, 'public');

            if ($path === false || $path === '') {
                continue;
            }

            $product->documents()->create([
                'title' => $file->getClientOriginalName(),
                'file' => $path,
                'type' => 'brosur',
                'sort_order' => ++$sortOrder,
            ]);
        }
    }

    /**
     * @param  array<int, int>  $ids
     */
    private function removeDocuments(Product $product, array $ids): void
    {
        if ($ids === []) {
            return;
        }

        $documents = $product->documents()->whereIn('id', $ids)->get();

        foreach ($documents as $document) {
            Storage::disk('public')->delete($document->file);
            $document->delete();
        }
    }

    private function mediaUrl(?string $path): ?string
    {
        return $path !== null ? Storage::disk('public')->url($path) : null;
    }
}
