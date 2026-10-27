<?php

namespace Database\Factories;

use App\Enums\ServicePreference;
use App\Enums\ServiceStatus;
use App\Models\Customer;
use App\Models\ServiceRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceRequest>
 */
class ServiceRequestFactory extends Factory
{
    protected $model = ServiceRequest::class;

    public function definition(): array
    {
        return [
            'code' => 'SRV-'.fake()->unique()->numerify('######'),
            'customer_id' => Customer::factory(),
            'equipment_name' => implode(' ', (array) fake()->words(3)),
            'brand' => fake()->company(),
            'model' => fake()->bothify('MDL-####'),
            'serial_number' => fake()->bothify('SN-####-????'),
            'issue' => fake()->sentence(),
            'location' => fake()->city(),
            'preference' => ServicePreference::TeknisiDatang,
            'status' => ServiceStatus::Diterima,
            'technician_id' => null,
            'estimated_cost' => null,
            'scheduled_at' => null,
            'completed_at' => null,
            'notes' => null,
        ];
    }
}
