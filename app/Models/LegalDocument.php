<?php

namespace App\Models;

use Database\Factories\LegalDocumentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property string|null $notes
 * @property string $file
 * @property string $type
 * @property string|null $group
 * @property string|null $issued_by
 * @property Carbon|null $issued_at
 * @property Carbon|null $expires_at
 * @property bool $is_published
 * @property int $sort_order
 */
#[Fillable(['title', 'slug', 'description', 'notes', 'file', 'type', 'group', 'issued_by', 'issued_at', 'expires_at', 'is_published', 'sort_order'])]
class LegalDocument extends Model
{
    /** @use HasFactory<LegalDocumentFactory> */
    use HasFactory;

    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'issued_at' => 'date',
            'expires_at' => 'date',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function getIsExpiredAttribute(): bool
    {
        if (! $this->expires_at) {
            return false;
        }

        return $this->expires_at->isPast();
    }

    public function getExpiresInDaysAttribute(): ?int
    {
        if (! $this->expires_at) {
            return null;
        }

        if ($this->expires_at->isPast()) {
            return 0;
        }

        return now()->diffInDays($this->expires_at);
    }
}
