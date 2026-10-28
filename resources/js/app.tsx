import { createInertiaApp } from '@inertiajs/react';
import { lazy, Suspense, type ReactNode } from 'react';
import AuthLayout from './layouts/AuthLayout';
import PublicLayout from './layouts/PublicLayout';
import { captureTracking } from './lib/tracking';

captureTracking();

const appName =
    import.meta.env.VITE_APP_NAME || 'PT. Mandalika Global Alkesindo';

function buildPageTitle(title: string): string {
    if (!title) {
        return appName;
    }

    const candidate = `${title} — ${appName}`;

    return title.includes('Mandalika') || candidate.length > 62
        ? title
        : candidate;
}

const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

function AdminLayoutBoundary({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <AdminLayout>{children}</AdminLayout>
        </Suspense>
    );
}

void createInertiaApp({
    title: (title) => buildPageTitle(title),
    layout: (name) => {
        if (name.startsWith('admin/')) {
            return AdminLayoutBoundary;
        }

        if (name.startsWith('auth/')) {
            return AuthLayout;
        }

        return PublicLayout;
    },
    progress: {
        color: 'var(--primary)',
    },
});
