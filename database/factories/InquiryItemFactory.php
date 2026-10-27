<?php

namespace Database\Factories;

use App\Models\Inquiry;
use App\Models\InquiryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InquiryItem>
 */
class InquiryItemFactory extends Factory
{
    protected $model = InquiryItem::class;

    public function definition(): array
    {
        return [
            'inquiry_id' => Inquiry::factory(),
            'product_id' => null,
            'product_name_snapshot' => implode(' ', (array) fake()->words(3)),
            'brand_snapshot' => fake()->company(),
            'qty' => fake()->numberBetween(1, 5),
            'price_snapshot' => fake()->optional()->numberBetween(100000, 50000000),
        ];
    }
}
