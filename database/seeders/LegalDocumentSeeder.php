<?php

namespace Database\Seeders;

use App\Models\LegalDocument;
use Illuminate\Database\Seeder;

class LegalDocumentSeeder extends Seeder
{
    public function run(): void
    {
        $documents = [
            [
                'title' => 'NIB (Nomor Induk Berusaha)',
                'slug' => 'nib',
                'description' => 'Nomor Induk Berusaha PT. Mandalika Global Alkesindo.',
                'file' => '/storage/legal/nib.pdf',
                'type' => 'nib',
                'issued_by' => 'OSS RBA',
                'issued_at' => '2024-01-15',
                'is_published' => true,
                'sort_order' => 10,
            ],
            [
                'title' => 'Izin Edar Alat Kesehatan (AKL)',
                'slug' => 'izin-edar-akl',
                'description' => 'Izin edar alat kesehatan yang didistribusikan.',
                'file' => '/storage/legal/izin-edar-akl.pdf',
                'type' => 'izin_edar',
                'issued_by' => 'Kementerian Kesehatan RI',
                'issued_at' => '2024-02-20',
                'is_published' => true,
                'sort_order' => 20,
            ],
            [
                'title' => 'Sertifikat CDAKB',
                'slug' => 'sertifikat-cdakb',
                'description' => 'Sertifikat Cara Distribusi Alat Kesehatan yang Baik.',
                'file' => '/storage/legal/cdakb.pdf',
                'type' => 'sertifikat',
                'issued_by' => 'Kementerian Kesehatan RI',
                'issued_at' => '2024-03-10',
                'is_published' => true,
                'sort_order' => 30,
            ],
        ];

        foreach ($documents as $document) {
            LegalDocument::query()->updateOrCreate(
                ['slug' => $document['slug']],
                $document,
            );
        }
    }
}
