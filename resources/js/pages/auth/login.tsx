import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { home } from '@/routes';
import { store } from '@/routes/login';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        form.post(store.url(), {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk" />

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
                <p className="text-[0.65rem] font-bold tracking-[0.18em] text-accent-foreground uppercase">
                    Akses tim internal
                </p>
                <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
                    Masuk ke panel admin
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Gunakan akun yang diberikan admin untuk mengelola katalog,
                    lead, dan tiket servis.
                </p>

                <form onSubmit={submit} className="mt-7 space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="username"
                            autoFocus
                            required
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                            aria-invalid={Boolean(form.errors.email)}
                            aria-describedby={
                                form.errors.email ? 'email-error' : undefined
                            }
                            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 aria-invalid:border-destructive"
                            placeholder="nama@mga.my.id"
                        />
                        {form.errors.email && (
                            <p
                                id="email-error"
                                className="mt-2 text-xs font-medium text-destructive"
                            >
                                {form.errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold"
                            >
                                Kata sandi
                            </label>
                            <span className="text-[0.68rem] text-muted-foreground">
                                Lupa sandi? Hubungi admin.
                            </span>
                        </div>
                        <div className="relative mt-2">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                autoComplete="current-password"
                                required
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData('password', event.target.value)
                                }
                                aria-invalid={Boolean(form.errors.password)}
                                aria-describedby={
                                    form.errors.password
                                        ? 'password-error'
                                        : undefined
                                }
                                className="h-11 w-full rounded-md border border-input bg-background pr-11 pl-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 aria-invalid:border-destructive"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((visible) => !visible)
                                }
                                className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground"
                                aria-label={
                                    showPassword
                                        ? 'Sembunyikan kata sandi'
                                        : 'Tampilkan kata sandi'
                                }
                            >
                                {showPassword ? (
                                    <EyeOff
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <Eye
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </div>
                        {form.errors.password && (
                            <p
                                id="password-error"
                                className="mt-2 text-xs font-medium text-destructive"
                            >
                                {form.errors.password}
                            </p>
                        )}
                    </div>

                    <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={form.data.remember}
                            onChange={(event) =>
                                form.setData('remember', event.target.checked)
                            }
                            className="size-4 rounded-sm border-input accent-primary"
                        />
                        Ingat saya di perangkat ini
                    </label>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <LogIn className="size-4" aria-hidden="true" />
                        {form.processing ? 'Memeriksa…' : 'Masuk'}
                    </button>
                </form>

                <p className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">
                    Halaman ini hanya untuk staf. Butuh bantuan?{' '}
                    <Link
                        href={home.url()}
                        className="font-semibold text-foreground hover:underline"
                    >
                        Kembali ke situs
                    </Link>
                    .
                </p>
            </div>
        </>
    );
}
