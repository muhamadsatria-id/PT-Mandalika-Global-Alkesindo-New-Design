import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    ExternalLink,
    FileText,
    FolderTree,
    HelpCircle,
    Image as ImageIcon,
    Inbox,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquareQuote,
    Package,
    Settings,
    Tags,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import ThemeToggle from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { home, logout } from '@/routes';
import admin from '@/routes/admin';
import type { SharedData } from '@/types';

type AdminLayoutProps = {
    children: ReactNode;
};

const navigation = [
    {
        label: 'Dashboard',
        href: admin.dashboard.url(),
        icon: LayoutDashboard,
        permissions: [],
    },
    {
        label: 'Produk',
        href: admin.products.index.url(),
        icon: Package,
        permissions: ['products.view', 'products.manage'],
    },
    {
        label: 'Kategori',
        href: admin.categories.index.url(),
        icon: FolderTree,
        permissions: ['products.manage', 'content.manage'],
    },
    {
        label: 'Brand',
        href: admin.brands.index.url(),
        icon: Tags,
        permissions: ['products.manage', 'content.manage'],
    },
    {
        label: 'Lead',
        href: admin.inquiries.index.url(),
        icon: Inbox,
        permissions: ['inquiries.view', 'inquiries.manage'],
    },
    {
        label: 'Servis',
        href: admin.services.index.url(),
        icon: Wrench,
        permissions: ['services.view', 'services.manage'],
    },
    {
        label: 'Pelanggan',
        href: admin.customers.index.url(),
        icon: Users,
        permissions: ['customers.view', 'customers.manage'],
    },
    {
        label: 'Pengaturan',
        href: admin.settings.index.url(),
        icon: Settings,
        permissions: ['content.manage'],
    },
    {
        label: 'Legalitas',
        href: admin.legalDocuments.index.url(),
        icon: FileText,
        permissions: ['content.manage'],
    },
    {
        label: 'Kategori Galeri',
        href: admin.galleryCategories.index.url(),
        icon: FolderTree,
        permissions: ['content.manage'],
    },
    {
        label: 'Item Galeri',
        href: admin.galleryItems.index.url(),
        icon: ImageIcon,
        permissions: ['content.manage'],
    },
    {
        label: 'Testimoni',
        href: admin.testimonials.index.url(),
        icon: MessageSquareQuote,
        permissions: ['content.manage'],
    },
    {
        label: 'FAQ',
        href: admin.faqs.index.url(),
        icon: HelpCircle,
        permissions: ['content.manage'],
    },
    {
        label: 'Partner Brand',
        href: admin.partnerBrands.index.url(),
        icon: Tags,
        permissions: ['content.manage'],
    },
    {
        label: 'Statistik',
        href: admin.companyStats.index.url(),
        icon: BarChart3,
        permissions: ['content.manage'],
    },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const page = usePage<SharedData>();
    const { auth, flash } = page.props;
    const permissions = auth.user?.permissions ?? [];
    const [mobileOpen, setMobileOpen] = useState(false);

    const visibleNavigation = navigation.filter(
        (item) =>
            item.permissions.length === 0 ||
            item.permissions.some((permission) =>
                permissions.includes(permission),
            ),
    );

    useEffect(() => {
        if (!mobileOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileOpen]);

    const isActive = (href: string): boolean =>
        page.url === href || page.url.startsWith(`${href}/`);

    const sidebarContent = (
        <>
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <Link
                    href={admin.dashboard.url()}
                    className="flex items-center gap-2.5"
                    aria-label="Dashboard admin PT. Mandalika Global Alkesindo"
                >
                    <span className="grid size-8 place-items-center rounded-[0.8rem] bg-primary text-[0.62rem] font-extrabold text-primary-foreground">
                        MGA
                    </span>
                    <span className="text-sm font-extrabold tracking-tight">
                        Panel Admin
                    </span>
                </Link>
                <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
                    aria-label="Tutup menu"
                >
                    <X className="size-4" aria-hidden="true" />
                </button>
            </div>

            <nav
                className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
                aria-label="Navigasi admin"
            >
                {visibleNavigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                                active
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                            )}
                        >
                            <Icon className="size-4" aria-hidden="true" />
                            {item.label}
                        </Link>
                    );
                })}

                <a
                    href={home.url()}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    Lihat situs
                </a>
            </nav>

            <div className="border-t border-border p-4">
                <div className="mb-3 px-1">
                    <p className="truncate text-sm font-semibold">
                        {auth.user?.name ?? 'Tim internal'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                        {auth.user?.role ?? 'Tanpa peran'}
                    </p>
                </div>
                <Link
                    href={logout.url()}
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="size-4" aria-hidden="true" />
                    Keluar
                </Link>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <a
                href="#konten"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
            >
                Lewati ke konten
            </a>

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-border bg-card md:flex',
                    mobileOpen &&
                        'flex translate-x-0 shadow-2xl motion-safe:transition-transform',
                )}
                aria-label="Sidebar admin"
            >
                {sidebarContent}
            </aside>

            <div className="md:pl-72">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
                            aria-label="Buka menu"
                            aria-expanded={mobileOpen}
                        >
                            <Menu className="size-4" aria-hidden="true" />
                        </button>
                        <div>
                            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                Panel operasional
                            </p>
                            <p className="text-sm font-semibold">
                                PT. Mandalika Global Alkesindo
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="hidden rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
                            {auth.user?.role ?? 'Tim internal'}
                        </span>
                        <ThemeToggle />
                    </div>
                </header>

                {flash?.success && (
                    <div
                        role="status"
                        className="mx-4 mt-4 rounded-md border border-success/30 bg-card px-4 py-3 text-sm sm:mx-6 lg:mx-8"
                    >
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div
                        role="alert"
                        className="mx-4 mt-4 rounded-md border border-destructive/30 bg-card px-4 py-3 text-sm sm:mx-6 lg:mx-8"
                    >
                        {flash.error}
                    </div>
                )}

                <main
                    id="konten"
                    className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
