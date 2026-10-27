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
    name: string;
    role: string | null;
    institution: string | null;
    quote: string;
    avatar: string | null;
    rating: number;
    is_published: boolean;
    sort_order: number;
};

type Props = { testimonial: Row | null };

export default function TestimonialForm({ testimonial }: Props) {
    const isEditing = testimonial !== null;
    const form = useForm({
        name: testimonial?.name ?? '',
        role: testimonial?.role ?? '',
        institution: testimonial?.institution ?? '',
        quote: testimonial?.quote ?? '',
        avatar: null as File | null,
        rating: testimonial ? String(testimonial.rating) : '5',
        is_published: testimonial?.is_published ?? true,
        sort_order: testimonial ? String(testimonial.sort_order) : '0',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (testimonial) {
            form.put(admin.testimonials.update.url(testimonial.id), {
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            form.post(admin.testimonials.store.url(), {
                preserveScroll: true,
                forceFormData: true,
            });
        }
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Konten"
                title={isEditing ? testimonial.name : 'Testimoni baru'}
                description="Tambahkan ulasan klien atau fasilitas kesehatan."
                back={{
                    href: admin.testimonials.index.url(),
                    label: 'Kembali ke daftar testimoni',
                }}
                actions={
                    <>
                        <Link
                            href={admin.testimonials.index.url()}
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
                                  : 'Simpan testimoni'}
                        </button>
                    </>
                }
            />
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr] xl:items-start">
                <div className="space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">
                            Informasi testimoni
                        </h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="Nama"
                                htmlFor="name"
                                required
                                error={form.errors.name}
                            >
                                <input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                            <FormField
                                label="Jabatan"
                                htmlFor="role"
                                error={form.errors.role}
                            >
                                <input
                                    id="role"
                                    value={form.data.role}
                                    onChange={(e) =>
                                        form.setData('role', e.target.value)
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                            <FormField
                                label="Institusi"
                                htmlFor="institution"
                                error={form.errors.institution}
                            >
                                <input
                                    id="institution"
                                    value={form.data.institution}
                                    onChange={(e) =>
                                        form.setData(
                                            'institution',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                            <FormField
                                label="Ulasan"
                                htmlFor="quote"
                                required
                                error={form.errors.quote}
                            >
                                <textarea
                                    id="quote"
                                    value={form.data.quote}
                                    onChange={(e) =>
                                        form.setData('quote', e.target.value)
                                    }
                                    className={textareaClass}
                                    rows={5}
                                />
                            </FormField>
                            <FormField
                                label="Avatar"
                                htmlFor="avatar"
                                error={form.errors.avatar}
                            >
                                <input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        form.setData(
                                            'avatar',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                            {isEditing && testimonial.avatar && (
                                <p className="text-xs text-muted-foreground">
                                    Avatar saat ini: {testimonial.avatar}
                                </p>
                            )}
                        </div>
                    </section>
                </div>
                <aside className="space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <h2 className="text-sm font-bold">Pengaturan</h2>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                label="Rating"
                                htmlFor="rating"
                                error={form.errors.rating}
                            >
                                <input
                                    id="rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={form.data.rating}
                                    onChange={(e) =>
                                        form.setData('rating', e.target.value)
                                    }
                                    className={inputClass}
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
                                        form.setData(
                                            'sort_order',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_published}
                                    onChange={(e) =>
                                        form.setData(
                                            'is_published',
                                            e.target.checked,
                                        )
                                    }
                                    className="size-4 accent-primary"
                                />
                                Terbitkan
                            </label>
                        </div>
                    </section>
                </aside>
            </div>
        </form>
    );
}
