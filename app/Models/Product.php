<?php

namespace App\Models;

use App\Enums\PriceMode;
use App\Enums\StockStatus;
use App\Models\Concerns\HasSlug;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $category_id
 * @property int $brand_id
 * @property string $name
 * @property string|null $model
 * @property string $slug
 * @property string|null $sku
 * @property string|null $short_description
 * @property string|null $description
 * @property int|null $price
 * @property PriceMode $price_mode
 * @property StockStatus $stock_status
 * @property bool $is_featured
 * @property bool $is_published
 * @property int $view_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'category_id',
    'brand_id',
    'name',
    'model',
    'slug',
    'sku',
    'short_description',
    'description',
    'price',
    'price_mode',
    'stock_status',
    'is_featured',
    'is_published',
    'view_count',
    'seo_title',
    'seo_description',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory, HasSlug, SoftDeletes {
        HasSlug::uniqueSlug as protected baseUniqueSlug;
    }

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'price_mode' => PriceMode::class,
            'stock_status' => StockStatus::class,
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'view_count' => 'integer',
        ];
    }

    protected function slugSource(): string
    {
        return 'name';
    }

    /**
     * Slug produk memakai nama dan model agar tidak bertabrakan antar model.
     */
    protected function uniqueSlug(string $base): string
    {
        $base = Str::slug($base.' '.$this->model);

        return $this->baseUniqueSlug($base === '' ? Str::lower(Str::random(8)) : $base);
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsTo<Brand, $this>
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * @return HasMany<ProductSpec, $this>
     */
    public function specs(): HasMany
    {
        return $this->hasMany(ProductSpec::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<ProductMedia, $this>
     */
    public function media(): HasMany
    {
        return $this->hasMany(ProductMedia::class)
            ->orderByDesc('is_primary')
            ->orderBy('sort_order');
    }

    /**
     * @return HasOne<ProductMedia, $this>
     */
    public function primaryMedia(): HasOne
    {
        return $this->hasOne(ProductMedia::class)->where('is_primary', true);
    }

    /**
     * @return HasMany<ProductDocument, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(ProductDocument::class)->orderBy('sort_order');
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * @param  Builder<Product>  $query
     */
    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    public function displayPrice(): ?string
    {
        if ($this->price_mode === PriceMode::Contact || $this->price === null) {
            return null;
        }

        return 'Rp '.number_format($this->price, 0, ',', '.');
    }
}
