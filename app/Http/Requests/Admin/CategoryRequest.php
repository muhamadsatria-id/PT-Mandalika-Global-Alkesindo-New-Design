<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $category = $this->route('category');
        $currentId = $category instanceof Category ? $category->id : null;

        $parentRules = ['nullable', 'integer', 'exists:categories,id'];

        if ($currentId !== null) {
            $parentRules[] = 'not_in:'.$currentId;
        }

        return [
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'parent_id' => $parentRules,
            'description' => ['nullable', 'string', 'max:2000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama kategori wajib diisi.',
            'parent_id.not_in' => 'Kategori tidak bisa menjadi induk dirinya sendiri.',
        ];
    }
}
