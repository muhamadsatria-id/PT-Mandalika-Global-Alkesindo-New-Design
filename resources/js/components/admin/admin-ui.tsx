import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const inputClass =
    'h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30';

export const textareaClass =
    'w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30';

export const buttonPrimary =
    'inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60';

export const buttonSecondary =
    'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60';

export const buttonDanger =
    'inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-destructive/30 px-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60';

type PageHeaderProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    back?: { href: string; label: string };
    actions?: ReactNode;
};

export function PageHeader({
    eyebrow,
    title,
    description,
    back,
    actions,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                {back && (
                    <Link
                        href={back.href}
                        className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" aria-hidden="true" />
                        {back.label}
                    </Link>
                )}
                {eyebrow && (
                    <p className="text-[0.65rem] font-bold tracking-[0.18em] text-accent-foreground uppercase">
                        {eyebrow}
                    </p>
                )}
                <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

type FormFieldProps = {
    label: string;
    htmlFor?: string;
    required?: boolean;
    hint?: string;
    error?: string;
    className?: string;
    children: ReactNode;
};

export function FormField({
    label,
    htmlFor,
    required = false,
    hint,
    error,
    className,
    children,
}: FormFieldProps) {
    return (
        <div className={className}>
            <label
                htmlFor={htmlFor}
                className="text-xs font-bold tracking-wide text-foreground"
            >
                {label}
                {required && (
                    <span
                        className="ml-1 text-primary-strong"
                        aria-hidden="true"
                    >
                        *
                    </span>
                )}
            </label>
            <div className="mt-1.5">{children}</div>
            {hint && !error && (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {hint}
                </p>
            )}
            {error && (
                <p
                    className="mt-1.5 text-xs font-medium text-destructive"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

type StatItem = {
    label: string;
    value: string | number;
    hint?: string;
};

export function StatStrip({ items }: { items: StatItem[] }) {
    return (
        <div
            className={cn(
                'mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border',
                items.length === 2
                    ? 'sm:grid-cols-2'
                    : items.length === 3
                      ? 'sm:grid-cols-3'
                      : 'sm:grid-cols-2 xl:grid-cols-4',
            )}
        >
            {items.map((item) => (
                <div key={item.label} className="bg-card px-4 py-3.5">
                    <p className="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                        {item.label}
                    </p>
                    <p className="mt-1 text-xl font-extrabold tracking-tight tabular-nums">
                        {item.value}
                    </p>
                    {item.hint && (
                        <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
                            {item.hint}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
