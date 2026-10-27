<?php

namespace App\Enums;

enum StockStatus: string
{
    case Ready = 'Ready';
    case Indent = 'Indent';
    case PreOrder = 'Pre-order';
    case Habis = 'Habis';

    public function label(): string
    {
        return match ($this) {
            self::Ready => 'Tersedia',
            self::Indent => 'Indent',
            self::PreOrder => 'Pre-order',
            self::Habis => 'Habis',
        };
    }
}
