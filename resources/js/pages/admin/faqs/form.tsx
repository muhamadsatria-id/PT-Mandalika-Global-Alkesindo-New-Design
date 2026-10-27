import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    buttonPrimary,
    buttonSecondary,
    FormField,
    inputClass,
    PageHeader,
    textareaClass,
} from '@/components/admin/admin-ui';
import admin from '@/routes/admin';

type Row = {
    id: number;
    question: string;
    answer: string;
    is_published: boolean;
    sort_order: number;
};

type Props = { faq: Row | null };

export default function FaqForm({ faq }: Props) {
    const isEditing = faq !== null;
    const form = useForm({
        question: faq?.question ?? '',
        answer: faq?.answer ?? '',
        is_published: faq?.is_published ?? true,
        sort_order: faq ? String(faq.sort_order) : '0',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (faq) {
            form.put(admin.faqs.update.url(faq.id), { preserveScroll: true });
        } else {
            form.post(admin.faqs.store.url(), { preserveScroll: true });
        }
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Konten"
                title={isEditing ? 'Edit FAQ' : 'FAQ baru'}
                description="Kelola pertanyaan yang sering diajukan."
                back={{
                    href: admin.faqs.index.url(),
                    label: 'Kembali ke daftar FAQ',
                }}
                actions={
                    <>
                        <Link
                            href={admin.faqs.index.url()}
                            className={buttonSecondary}
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className={buttonPrimary}
                        >
                            <Save className="size-4" aria-hidden="true" />
                            {form.processing
                                ? 'Menyimpan…'
                                : isEditing
                                  ? 'Simpan perubahan'
                                  : 'Simpan FAQ'}
                        </button>
                    </>
                }
            />
            <div className="mt-6 rounded-lg border border-border bg-card p-5">
                <div className="grid gap-4">
                    <FormField
                        label="Pertanyaan"
                        htmlFor="question"
                        required
                        error={form.errors.question}
                    >
                        <input
                            id="question"
                            value={form.data.question}
                            onChange={(e) =>
                                form.setData('question', e.target.value)
                            }
                            className={inputClass}
                        />
                    </FormField>
                    <FormField
                        label="Jawaban"
                        htmlFor="answer"
                        required
                        error={form.errors.answer}
                    >
                        <textarea
                            id="answer"
                            value={form.data.answer}
                            onChange={(e) =>
                                form.setData('answer', e.target.value)
                            }
                            className={textareaClass}
                            rows={6}
                        />
                    </FormField>
                    <FormField
                        label="Urutan"
                        htmlFor="sort_order"
                        error={form.errors.sort_order}
                    >
                        <input
                            id="sort_order"
                            type="number"
                            value={form.data.sort_order}
                            onChange={(e) =>
                                form.setData('sort_order', e.target.value)
                            }
                            className={inputClass}
                        />
                    </FormField>
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                            type="checkbox"
                            checked={form.data.is_published}
                            onChange={(e) =>
                                form.setData('is_published', e.target.checked)
                            }
                            className="size-4 accent-primary"
                        />
                        Terbitkan
                    </label>
                </div>
            </div>
        </form>
    );
}
