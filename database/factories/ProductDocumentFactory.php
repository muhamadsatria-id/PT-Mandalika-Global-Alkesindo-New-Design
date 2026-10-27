<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductDocument>
 */
class ProductDocumentFactory extends Factory
{
    protected $model = ProductDocument::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'title' => 'Brosur '.implode(' ', (array) fake()->words(2)),
            'file' => 'documents/'.fake()->uuid().'.pdf',
            'type' => fake()->randomElement(['brosur', 'izin_edar', 'manual']),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
