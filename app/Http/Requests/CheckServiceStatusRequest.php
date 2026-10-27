<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckServiceStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('code'))) {
            $this->merge([
                'code' => strtoupper(trim($this->input('code'))),
            ]);
        }

        if (is_string($this->input('phone4'))) {
            $this->merge([
                'phone4' => preg_replace('/\D+/', '', $this->input('phone4')) ?? '',
            ]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'regex:/^SRV-\d{4}-\d{5}$/'],
            'phone4' => ['required', 'string', 'digits:4'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Kode tiket wajib diisi.',
            'code.regex' => 'Format kode tiket tidak sesuai. Contoh: SRV-2026-00045.',
            'phone4.required' => 'Masukkan 4 digit terakhir nomor WhatsApp.',
            'phone4.digits' => 'Masukkan tepat 4 digit terakhir nomor WhatsApp.',
        ];
    }
}
