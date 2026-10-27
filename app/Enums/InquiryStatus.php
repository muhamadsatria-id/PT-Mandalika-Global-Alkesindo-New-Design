<?php

namespace App\Enums;

enum InquiryStatus: string
{
    case Baru = 'Baru';
    case Dihubungi = 'Dihubungi';
    case PenawaranTerkirim = 'Penawaran Terkirim';
    case Negosiasi = 'Negosiasi';
    case Deal = 'Deal';
    case Batal = 'Batal';

    public function label(): string
    {
        return $this->value;
    }

    public function isFinal(): bool
    {
        return in_array($this, [self::Deal, self::Batal], true);
    }
}
