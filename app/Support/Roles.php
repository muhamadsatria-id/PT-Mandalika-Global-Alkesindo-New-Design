<?php

namespace App\Support;

final class Roles
{
    public const SuperAdmin = 'Super Admin';

    public const AdminKatalog = 'Admin Katalog';

    public const Sales = 'Sales / CS';

    public const Teknisi = 'Teknisi / Service';

    public const Marketing = 'Marketing / Konten';

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
            self::SuperAdmin,
            self::AdminKatalog,
            self::Sales,
            self::Teknisi,
            self::Marketing,
        ];
    }
}
