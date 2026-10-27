<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $name = fake()->word().' '.fake()->word();

        return [
            'parent_id' => null,
            'name' => $name,
            'slug' => fake()->unique()->slug(),
            'description' => fake()->sentence(),
            'icon' => null,
            'sort_order' => fake()->numberBetween(1, 100),
        ];
    }
}
