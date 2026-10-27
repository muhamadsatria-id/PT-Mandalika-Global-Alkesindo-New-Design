<?php

namespace App\Http\Requests\Admin;

use App\Enums\PriceMode;
use App\Enums\StockStatus;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
        $product = $this->route('product');
        $productId = $product instanceof Product ? $product->id : null;

        return [
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')->whereNull('deleted_at')],
            'brand_id' => ['required', 'integer', Rule::exists('brands', 'id')->whereNull('deleted_at')],
            'name' => ['required', 'string', 'min:2', 'max:200'],
            'model' => ['nullable', 'string', 'max:120'],
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:20000'],
            'price' => ['nullable', 'integer', 'min:0', 'max:9999999999', 'required_if:price_mode,show'],
            'price_mode' => ['required', Rule::enum(PriceMode::class)],
            'stock_status' => ['required', Rule::enum(StockStatus::class)],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'specs' => ['nullable', 'array', 'max:40'],
            'specs.*.label' => ['nullable', 'string', 'max:100'],
            'specs.*.value' => ['nullable', 'string', 'max:255'],
            'media' => ['nullable', 'array', 'max:5'],
            'media.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'documents' => ['nullable', 'array', 'max:5'],
            'documents.*' => ['file', 'mimes:pdf', 'max:5120'],
            'removed_media' => ['nullable', 'array'],
            'removed_media.*' => ['integer'],
            'removed_documents' => ['nullable', 'array'],
            'removed_documents.*' => ['integer'],
            'primary_media_id' => ['nullable', 'integer'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category_id.required' => 'Pilih kategori produk.',
            'brand_id.required' => 'Pilih brand produk.',
            'name.required' => 'Nama produk wajib diisi.',
            'sku.unique' => 'SKU ini sudah dipakai produk lain.',
            'price.required_if' => 'Isi harga ketika mode harga diatur "Tampilkan harga".',
            'price.integer' => 'Harga harus berupa angka tanpa titik atau koma.',
            'price_mode.required' => 'Pilih mode harga.',
            'stock_status.required' => 'Pilih status ketersediaan.',
            'media.*.image' => 'Foto produk harus berupa gambar.',
            'media.*.mimes' => 'Format foto harus JPG, PNG, atau WebP.',
            'media.*.max' => 'Ukuran tiap foto maksimal 4 MB.',
            'documents.*.mimes' => 'Dokumen harus berupa PDF.',
            'documents.*.max' => 'Ukuran tiap dokumen maksimal 5 MB.',
        ];
    }
}
