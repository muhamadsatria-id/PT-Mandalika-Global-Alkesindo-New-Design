<?php

namespace App\Models;

use Database\Factories\CompanyStatFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $label
 * @property string $value
 * @property bool $is_published
 * @property int $sort_order
 */
#[Fillable(['label', 'value', 'is_published', 'sort_order'])]
class CompanyStat extends Model
{
    /** @use HasFactory<CompanyStatFactory> */
    use HasFactory;

    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
