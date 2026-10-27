<?php

namespace App\Http\Requests;

use App\Enums\ServicePreference;
use App\Rules\Turnstile;
use App\Services\WhatsAppLinkService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
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
            'equipment_name' => ['required', 'string', 'min:2', 'max:150'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'issue' => ['required', 'string', 'min:10', 'max:2000'],
            'location' => ['required', 'string', 'min:2', 'max:150'],
            'preference' => ['required', Rule::enum(ServicePreference::class)],
            'media' => ['nullable', 'array', 'max:3'],
            'media.*' => [
                'file',
                'mimes:jpg,jpeg,png,webp,mp4,mov,webm',
                'max:10240',
            ],
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
            'equipment_name.required' => 'Nama alat wajib diisi.',
            'issue.required' => 'Jelaskan keluhan atau gejala yang terjadi.',
            'issue.min' => 'Jelaskan keluhan sedikit lebih detail, minimal 10 karakter.',
            'location.required' => 'Lokasi alat wajib diisi.',
            'preference.required' => 'Pilih cara penanganan yang Anda inginkan.',
            'media.max' => 'Unggah maksimal 3 foto atau video.',
            'media.*.mimes' => 'Berkas harus berupa foto (JPG, PNG, WebP) atau video (MP4, MOV, WebM).',
            'media.*.max' => 'Ukuran setiap berkas maksimal 10 MB.',
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
            'equipment_name' => 'nama alat',
            'issue' => 'keluhan',
            'location' => 'lokasi alat',
            'preference' => 'preferensi penanganan',
            'media' => 'lampiran',
        ];
    }
}
