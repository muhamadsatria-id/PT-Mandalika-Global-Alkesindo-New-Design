<?php

namespace Database\Factories;

use App\Models\ServiceAttachment;
use App\Models\ServiceRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceAttachment>
 */
class ServiceAttachmentFactory extends Factory
{
    protected $model = ServiceAttachment::class;

    public function definition(): array
    {
        return [
            'service_request_id' => ServiceRequest::factory(),
            'file' => 'service/'.fake()->uuid().'.jpg',
            'type' => fake()->randomElement(['image', 'video', 'document']),
        ];
    }
}
