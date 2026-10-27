<?php

namespace Database\Factories;

use App\Enums\ServiceStatus;
use App\Models\ServiceLog;
use App\Models\ServiceRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceLog>
 */
class ServiceLogFactory extends Factory
{
    protected $model = ServiceLog::class;

    public function definition(): array
    {
        return [
            'service_request_id' => ServiceRequest::factory(),
            'status' => ServiceStatus::Diterima->value,
            'note' => fake()->sentence(),
            'user_id' => null,
        ];
    }
}
