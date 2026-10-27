<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = implode(' ', (array) fake()->unique()->words(3));

        return [
            'category_id' => Category::factory(),
            'brand_id' => Brand::factory(),
            'name' => ucfirst($name),
            'model' => fake()->bothify('MDL-####'),
            'slug' => Str::slug($name),
            'sku' => fake()->unique()->bothify('SKU-####'),
            'short_description' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(100000, 50000000),
            'price_mode' => 'show',
            'stock_status' => 'Ready',
            'is_featured' => fake()->boolean(20),
            'is_published' => true,
            'view_count' => 0,
        ];
    }
}
