<?php

namespace Database\Factories;

use App\Enums\InquiryStatus;
use App\Models\Customer;
use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inquiry>
 */
class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    public function definition(): array
    {
        return [
            'code' => 'INQ-'.fake()->unique()->numerify('######'),
            'customer_id' => Customer::factory(),
            'status' => InquiryStatus::Baru,
            'assigned_to' => null,
            'notes' => null,
            'utm_source' => fake()->optional(0.5)->randomElement(['google', 'instagram', 'whatsapp']),
            'utm_medium' => fake()->optional(0.4)->randomElement(['cpc', 'social', 'referral']),
            'utm_campaign' => fake()->optional(0.3)->slug(),
            'referrer' => null,
            'landing_url' => fake()->optional()->url(),
            'ip_hash' => hash('sha256', fake()->ipv4()),
        ];
    }
}
