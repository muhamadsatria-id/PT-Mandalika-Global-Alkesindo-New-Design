export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
};

export type ProductCard = {
    id: number;
    name: string;
    slug: string;
    model: string | null;
    sku?: string | null;
    brand: string | null;
    brand_slug?: string | null;
    category: string | null;
    category_slug?: string | null;
    price: string | null;
    price_value?: number | null;
    price_mode?: string;
    stock_status: string;
    stock_label: string;
    is_featured?: boolean;
    image: string | null;
    url: string;
};

export type CatalogOption = {
    name: string;
    slug: string;
    count: number;
};

export type SeoData = {
    title: string;
    description?: string | null;
    canonical?: string;
};

export type QuoteItem = {
    id: number;
    slug: string;
    name: string;
    brand: string | null;
    model: string | null;
    price: string | null;
    url: string;
    image: string | null;
    qty: number;
};
