<?php

namespace App\Models;

use App\Enums\ServicePreference;
use App\Enums\ServiceStatus;
use Database\Factories\ServiceRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $code
 * @property int $customer_id
 * @property string $equipment_name
 * @property string|null $brand
 * @property string|null $model
 * @property string|null $serial_number
 * @property string $issue
 * @property string|null $location
 * @property ServicePreference $preference
 * @property ServiceStatus $status
 * @property int|null $technician_id
 * @property int|null $estimated_cost
 * @property Carbon|null $scheduled_at
 * @property Carbon|null $completed_at
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'code',
    'customer_id',
    'equipment_name',
    'brand',
    'model',
    'serial_number',
    'issue',
    'location',
    'preference',
    'status',
    'technician_id',
    'estimated_cost',
    'scheduled_at',
    'completed_at',
    'notes',
])]
class ServiceRequest extends Model
{
    /** @use HasFactory<ServiceRequestFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::created(function (ServiceRequest $serviceRequest): void {
            $serviceRequest->logs()->create([
                'status' => $serviceRequest->status,
                'note' => null,
                'user_id' => null,
            ]);
        });
    }

    protected function casts(): array
    {
        return [
            'preference' => ServicePreference::class,
            'status' => ServiceStatus::class,
            'estimated_cost' => 'integer',
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Tiket yang belum mencapai status akhir.
     *
     * @param  Builder<ServiceRequest>  $query
     */
    public function scopeOpen(Builder $query): void
    {
        $query->whereNotIn('status', ServiceStatus::finalValues());
    }

    /**
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    /**
     * @return HasMany<ServiceLog, $this>
     */
    public function logs(): HasMany
    {
        return $this->hasMany(ServiceLog::class)->latest('created_at')->latest('id');
    }

    /**
     * @return HasMany<ServiceAttachment, $this>
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(ServiceAttachment::class);
    }
}
