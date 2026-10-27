import type { PageProps } from '@inertiajs/core';

export type SharedSettings = Record<string, string | null>;

export type SharedNavProduct = {
    id: number;
    name: string;
    slug: string;
    brand: string | null;
    model: string | null;
    url: string;
    image: string | null;
};

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: string | null;
    permissions: string[];
};

export type SharedData = PageProps & {
    name: string;
    auth: {
        user: AuthUser | null;
    };
    settings: SharedSettings;
    navProducts: SharedNavProduct[];
    turnstileSiteKey: string | null;
    flash: {
        success: string | null;
        error: string | null;
    };
};
