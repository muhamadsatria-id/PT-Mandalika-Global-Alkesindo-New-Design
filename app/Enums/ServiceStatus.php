<?php

namespace App\Enums;

enum ServiceStatus: string
{
    case Diterima = 'Diterima';
    case Dijadwalkan = 'Dijadwalkan';
    case Diagnosa = 'Diagnosa';
    case MenungguPersetujuan = 'Menunggu Persetujuan';
    case Dikerjakan = 'Dikerjakan';
    case Pengujian = 'Pengujian';
    case Selesai = 'Selesai';
    case Diambil = 'Diambil';
    case Dikirim = 'Dikirim';
    case Batal = 'Batal';

    public function label(): string
    {
        return $this->value;
    }

    public function isFinal(): bool
    {
        return in_array($this, [self::Selesai, self::Diambil, self::Dikirim, self::Batal], true);
    }

    /**
     * @return array<int, string>
     */
    public static function finalValues(): array
    {
        return array_values(array_map(
            fn (self $status): string => $status->value,
            array_filter(self::cases(), fn (self $status): bool => $status->isFinal()),
        ));
    }
}
