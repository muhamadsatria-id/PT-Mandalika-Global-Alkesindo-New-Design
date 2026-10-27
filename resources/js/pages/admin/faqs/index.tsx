import { Link, router, usePage } from '@inertiajs/react';
import { HelpCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import { buttonPrimary, PageHeader } from '@/components/admin/admin-ui';
import admin from '@/routes/admin';
import type { SharedData } from '@/types';

type Row = {
    id: number;
    question: string;
    answer: string;
    is_published: boolean;
    sort_order: number;
};

export default function FaqsIndex({ faqs }: { faqs: Row[] }) {
    const { auth } = usePage<SharedData>().props;
    const canManage =
        auth.user?.permissions.includes('content.manage') ?? false;

    const remove = (row: Row): void => {
        if (window.confirm(`Hapus FAQ "${row.question}"?`)) {
            router.delete(admin.faqs.destroy.url(row.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <PageHeader
                eyebrow="Konten"
                title="FAQ"
                description="Kelola pertanyaan yang sering diajukan."
                actions={
                    <Link
                        href={admin.faqs.create.url()}
                        className={buttonPrimary}
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        FAQ baru
                    </Link>
                }
            />
            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
                {faqs.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <HelpCircle
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="mt-3 text-sm font-bold">Belum ada FAQ</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[48rem] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">
                                        Pertanyaan
                                    </th>
                                    <th className="px-3 py-3 text-center font-bold">
                                        Urutan
                                    </th>
                                    <th className="px-3 py-3 text-center font-bold">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-border/70 last:border-0"
                                    >
                                        <td className="px-4 py-3 font-semibold">
                                            {row.question}
                                        </td>
                                        <td className="px-3 py-3 text-center font-mono text-xs">
                                            {row.sort_order}
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            {row.is_published
                                                ? 'Terbit'
                                                : 'Draf'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={admin.faqs.edit.url(
                                                        row.id,
                                                    )}
                                                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                                >
                                                    <Pencil
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                                {canManage && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            remove(row)
                                                        }
                                                        className="inline-flex size-8 items-center justify-center rounded-md border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
                                                    >
                                                        <Trash2
                                                            className="size-3.5"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
