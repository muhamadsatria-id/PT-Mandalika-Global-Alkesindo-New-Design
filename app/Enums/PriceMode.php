<?php

namespace App\Enums;

enum PriceMode: string
{
    case Show = 'show';
    case Contact = 'contact';

    public function label(): string
    {
        return match ($this) {
            self::Show => 'Tampilkan harga',
            self::Contact => 'Hubungi untuk harga',
        };
    }
}
