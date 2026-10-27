<?php

namespace App\Support;

final class Permissions
{
    public const ProductsView = 'products.view';

    public const ProductsManage = 'products.manage';

    public const InquiriesView = 'inquiries.view';

    public const InquiriesManage = 'inquiries.manage';

    public const CustomersView = 'customers.view';

    public const CustomersManage = 'customers.manage';

    public const ServicesView = 'services.view';

    public const ServicesManage = 'services.manage';

    public const ContentManage = 'content.manage';

    public const UsersManage = 'users.manage';

    public const SettingsManage = 'settings.manage';

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
            self::ProductsView,
            self::ProductsManage,
            self::InquiriesView,
            self::InquiriesManage,
            self::CustomersView,
            self::CustomersManage,
            self::ServicesView,
            self::ServicesManage,
            self::ContentManage,
            self::UsersManage,
            self::SettingsManage,
        ];
    }
}
