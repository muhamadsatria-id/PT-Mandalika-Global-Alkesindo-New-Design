import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import ThemeToggle from '@/components/theme-toggle';
import { home } from '@/routes';
import type { SharedData } from '@/types';

type AuthLayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    const { settings } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[1.05fr_1fr]">
            <Head>
                <meta
                    head-key="robots"
                    name="robots"
                    content="noindex,nofollow"
                />
            </Head>

            <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-secondary/50 p-10 lg:flex">
                <div
                    className="pointer-events-none absolute -top-24 -right-28 size-96 rounded-full border border-primary/25"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute right-16 bottom-24 size-20 rounded-lg bg-primary/10"
                    aria-hidden="true"
                />

                <Link
                    href={home.url()}
                    className="relative z-10 inline-flex items-center gap-2.5"
                    aria-label="Kembali ke situs PT. Mandalika Global Alkesindo"
                >
                    <span className="grid size-9 place-items-center rounded-[0.9rem] bg-primary text-[0.7rem] font-extrabold text-primary-foreground">
                        MGA
                    </span>
                    <span className="flex flex-col leading-none">
                        <span className="text-[0.95rem] font-extrabold tracking-tight">
                            Mandalika Global
                        </span>
                        <span className="mt-1 text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                            Alkesindo
                        </span>
                    </span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <p className="text-xs font-bold tracking-[0.18em] text-accent-foreground uppercase">
                        Area internal
                    </p>
                    <h1 className="mt-4 text-4xl leading-[1.05] font-extrabold tracking-tight">
                        Ruang kerja tim Mandalika.
                    </h1>
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        Kelola katalog alat kesehatan, lead penjualan, dan tiket
                        servis dari satu tempat. Setiap perubahan tercatat agar
                        tim sales dan teknisi bekerja dari data yang sama.
                    </p>
                </div>

                <div className="relative z-10 space-y-2 text-sm text-muted-foreground">
                    {settings.company_hours && (
                        <p className="flex items-center gap-2">
                            <Clock
                                className="size-4 text-primary"
                                aria-hidden="true"
                            />
                            {settings.company_hours}
                        </p>
                    )}
                    {settings.company_address && (
                        <p className="flex items-center gap-2">
                            <MapPin
                                className="size-4 text-primary"
                                aria-hidden="true"
                            />
                            {settings.company_address}
                        </p>
                    )}
                    <p className="pt-2 text-xs">
                        Akses hanya untuk staf yang berwenang.
                    </p>
                </div>
            </aside>

            <div className="flex min-h-screen flex-col">
                <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6 lg:justify-end lg:border-b-0">
                    <Link
                        href={home.url()}
                        className="inline-flex items-center gap-2.5 lg:hidden"
                        aria-label="Kembali ke situs"
                    >
                        <span className="grid size-8 place-items-center rounded-[0.8rem] bg-primary text-[0.62rem] font-extrabold text-primary-foreground">
                            MGA
                        </span>
                        <span className="text-sm font-extrabold tracking-tight">
                            Mandalika Global
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href={home.url()}
                            className="hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
                        >
                            <ArrowLeft
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Kembali ke situs
                        </Link>
                        <ThemeToggle />
                    </div>
                </header>

                <main
                    id="konten"
                    className="flex flex-1 items-start justify-center px-4 py-10 sm:px-6 lg:items-center lg:py-16"
                >
                    <div className="w-full max-w-md">{children}</div>
                </main>

                <footer className="border-t border-border px-4 py-5 text-xs text-muted-foreground sm:px-6">
                    © {new Date().getFullYear()} PT. Mandalika Global Alkesindo.
                </footer>
            </div>
        </div>
    );
}
