<?php

namespace App\Models;

use Database\Factories\InquiryItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $inquiry_id
 * @property int|null $product_id
 * @property string $product_name_snapshot
 * @property string|null $brand_snapshot
 * @property int $qty
 * @property int|null $price_snapshot
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['inquiry_id', 'product_id', 'product_name_snapshot', 'brand_snapshot', 'qty', 'price_snapshot'])]
class InquiryItem extends Model
{
    /** @use HasFactory<InquiryItemFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'qty' => 'integer',
            'price_snapshot' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Inquiry, $this>
     */
    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(Inquiry::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
