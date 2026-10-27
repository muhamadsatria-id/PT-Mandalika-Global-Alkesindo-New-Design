<?php

namespace Database\Factories;

use App\Enums\WaEventType;
use App\Models\WaEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WaEvent>
 */
class WaEventFactory extends Factory
{
    protected $model = WaEvent::class;

    public function definition(): array
    {
        return [
            'type' => WaEventType::Click,
            'product_id' => null,
            'page_url' => fake()->url(),
            'utm_source' => fake()->optional()->randomElement(['google', 'instagram', 'whatsapp']),
            'utm_medium' => fake()->optional()->randomElement(['cpc', 'social', 'referral']),
            'utm_campaign' => fake()->optional()->slug(),
            'ip_hash' => hash('sha256', fake()->ipv4()),
        ];
    }
}
