<?php

namespace App\Enums;

enum ServicePreference: string
{
    case TeknisiDatang = 'teknisi_datang';
    case KirimAlat = 'kirim_alat';
    case AntarSendiri = 'antar_sendiri';

    public function label(): string
    {
        return match ($this) {
            self::TeknisiDatang => 'Teknisi datang',
            self::KirimAlat => 'Kirim alat',
            self::AntarSendiri => 'Antar sendiri',
        };
    }
}
