<?php

namespace App\Models;

use Database\Factories\PartnerBrandFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $logo
 * @property string|null $url
 * @property bool $is_active
 * @property int $sort_order
 */
#[Fillable(['name', 'slug', 'logo', 'url', 'is_active', 'sort_order'])]
class PartnerBrand extends Model
{
    /** @use HasFactory<PartnerBrandFactory> */
    use HasFactory;

    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
