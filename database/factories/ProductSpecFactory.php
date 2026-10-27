<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductSpec;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductSpec>
 */
class ProductSpecFactory extends Factory
{
    protected $model = ProductSpec::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'label' => fake()->randomElement(['Ukuran', 'Berat', 'Daya', 'Bahan']),
            'value' => implode(' ', (array) fake()->words(2)),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
