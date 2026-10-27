<?php

namespace Database\Factories;

use App\Models\WaTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WaTemplate>
 */
class WaTemplateFactory extends Factory
{
    protected $model = WaTemplate::class;

    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(),
            'title' => fake()->sentence(3),
            'body' => 'Halo {nama}, terima kasih sudah menghubungi kami.',
        ];
    }
}
