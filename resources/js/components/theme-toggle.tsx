import { Moon, Sun } from 'lucide-react';

/**
 * Tombol tema terang/gelap. Kelas `dark` diterapkan sebelum React berjalan
 * lewat skrip kecil di resources/views/app.blade.php agar tidak berkedip.
 */
export default function ThemeToggle() {
    const toggleTheme = (): void => {
        const isDark = document.documentElement.classList.toggle('dark');

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Ganti tema terang atau gelap"
            title="Ganti tema"
        >
            <Sun className="hidden size-4 dark:block" aria-hidden="true" />
            <Moon className="size-4 dark:hidden" aria-hidden="true" />
        </button>
    );
}
