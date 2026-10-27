<?php

namespace App\Http\Requests;

use App\Rules\Turnstile;
use App\Services\WhatsAppLinkService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('phone')) && trim($this->input('phone')) !== '') {
            $this->merge([
                'phone' => app(WhatsAppLinkService::class)->normalize($this->input('phone')),
            ]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'min:2', 'max:100'],
            'instansi' => ['required', 'string', 'min:2', 'max:150'],
            'kota' => ['required', 'string', 'min:2', 'max:100'],
            'phone' => ['required', 'string', 'regex:/^62\d{8,13}$/'],
            'email' => ['nullable', 'email', 'max:150'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1', 'max:20'],
            'items.*.product_id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('products', 'id')
                    ->where('is_published', true)
                    ->whereNull('deleted_at'),
            ],
            'items.*.qty' => ['required', 'integer', 'min:1', 'max:99'],
            'consent' => ['accepted'],
            'website' => ['nullable', 'string', 'max:0'],
            'utm_source' => ['nullable', 'string', 'max:255'],
            'utm_medium' => ['nullable', 'string', 'max:255'],
            'utm_campaign' => ['nullable', 'string', 'max:255'],
            'utm_term' => ['nullable', 'string', 'max:255'],
            'utm_content' => ['nullable', 'string', 'max:255'],
            'referrer' => ['nullable', 'string', 'max:2048'],
            'landing_url' => ['nullable', 'string', 'max:2048'],
            'source_url' => ['nullable', 'string', 'max:2048'],
            'turnstile_token' => ['nullable', 'string', new Turnstile],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama Anda wajib diisi.',
            'nama.min' => 'Nama minimal 2 karakter.',
            'instansi.required' => 'Nama instansi atau fasilitas kesehatan wajib diisi.',
            'kota.required' => 'Kota wajib diisi.',
            'phone.required' => 'Nomor WhatsApp wajib diisi.',
            'phone.regex' => 'Nomor WhatsApp tidak valid. Gunakan format 08xx atau 62xx.',
            'email.email' => 'Format email tidak valid.',
            'items.required' => 'Pilih minimal satu produk untuk dimintakan penawaran.',
            'items.min' => 'Pilih minimal satu produk untuk dimintakan penawaran.',
            'items.*.product_id.exists' => 'Salah satu produk tidak tersedia lagi. Hapus lalu pilih ulang.',
            'items.*.qty.min' => 'Jumlah minimal 1 unit.',
            'items.*.qty.max' => 'Jumlah maksimal 99 unit per produk.',
            'consent.accepted' => 'Anda perlu menyetujui penggunaan data untuk diproses tim kami.',
            'website.max' => 'Permintaan tidak dapat diproses.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nama' => 'nama',
            'instansi' => 'instansi',
            'kota' => 'kota',
            'phone' => 'nomor WhatsApp',
            'catatan' => 'catatan',
            'items' => 'daftar produk',
        ];
    }
}
