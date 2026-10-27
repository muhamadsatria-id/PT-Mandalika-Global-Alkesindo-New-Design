<?php

namespace App\Http\Requests\Admin;

use App\Enums\ServiceStatus;
use App\Models\User;
use App\Support\Permissions;
use App\Support\Roles;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
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
        return [
            'status' => ['required', Rule::enum(ServiceStatus::class)],
            'technician_id' => [
                'nullable',
                'integer',
                Rule::in($this->technicianIds()),
            ],
            'estimated_cost' => ['nullable', 'integer', 'min:0', 'max:9999999999'],
            'scheduled_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'status_note' => ['nullable', 'string', 'max:1000'],
            'attachments' => ['nullable', 'array', 'max:5'],
            'attachments.*' => [
                'file',
                'mimes:jpg,jpeg,png,webp,mp4,mov,webm,pdf',
                'max:10240',
            ],
            'removed_attachments' => ['nullable', 'array'],
            'removed_attachments.*' => ['integer'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Pilih status tiket.',
            'technician_id.in' => 'Teknisi yang dipilih tidak tersedia.',
            'estimated_cost.integer' => 'Estimasi biaya harus berupa angka.',
            'attachments.max' => 'Unggah maksimal 5 berkas sekaligus.',
            'attachments.*.mimes' => 'Berkas harus berupa foto, video, atau PDF.',
            'attachments.*.max' => 'Ukuran setiap berkas maksimal 10 MB.',
        ];
    }

    /**
     * Pengguna aktif yang boleh ditugaskan sebagai teknisi.
     *
     * @return array<int, int>
     */
    private function technicianIds(): array
    {
        return User::query()
            ->where('is_active', true)
            ->where(function ($query): void {
                $query->whereHas('roles', fn ($query) => $query->whereIn('name', [
                    Roles::Teknisi,
                    Roles::SuperAdmin,
                ]))->orWhereHas('permissions', fn ($query) => $query->where('name', Permissions::ServicesManage));
            })
            ->pluck('id')
            ->all();
    }
}
