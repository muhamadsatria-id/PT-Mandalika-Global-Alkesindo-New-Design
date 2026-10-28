import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    buttonPrimary,
    FormField,
    inputClass,
    PageHeader,
    textareaClass,
} from '@/components/admin/admin-ui';
import admin from '@/routes/admin';
import type { SharedSettings } from '@/types';

type Props = { settings: SharedSettings };

export default function SettingsIndex({ settings }: Props) {
    const form = useForm({
        company_name: settings.company_name ?? '',
        company_tagline: settings.company_tagline ?? '',
        company_email: settings.company_email ?? '',
        company_email_secondary: settings.company_email_secondary ?? '',
        company_address: settings.company_address ?? '',
        company_city: settings.company_city ?? '',
        company_hours: settings.company_hours ?? '',
        company_instagram: settings.company_instagram ?? '',
        company_facebook: settings.company_facebook ?? '',
        company_tiktok: settings.company_tiktok ?? '',
        company_youtube: settings.company_youtube ?? '',
        company_linkedin: settings.company_linkedin ?? '',
        developer_email: settings.developer_email ?? '',
        developer_whatsapp: settings.developer_whatsapp ?? '',
        whatsapp_number: settings.whatsapp_number ?? '',
        whatsapp_sales: settings.whatsapp_sales ?? '',
        whatsapp_service: settings.whatsapp_service ?? '',
        default_price_mode: settings.default_price_mode ?? 'show',
        seo_title: settings.seo_title ?? '',
        seo_description: settings.seo_description ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.put(admin.settings.update.url(), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit}>
            <PageHeader
                eyebrow="Pengaturan"
                title="Pengaturan perusahaan"
                description="Kelola identitas, kontak, media sosial, dan SEO dasar."
                actions={
                    <>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className={buttonPrimary}
                        >
                            <Save className="size-4" aria-hidden="true" />
                            {form.processing
                                ? 'Menyimpan…'
                                : 'Simpan pengaturan'}
                        </button>
                    </>
                }
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <section className="rounded-lg border border-border bg-card p-5">
                    <h2 className="text-sm font-bold">Identitas perusahaan</h2>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            label="Nama perusahaan"
                            htmlFor="company_name"
                            error={form.errors.company_name}
                        >
                            <input
                                id="company_name"
                                value={form.data.company_name}
                                onChange={(e) =>
                                    form.setData('company_name', e.target.value)
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="Tagline"
                            htmlFor="company_tagline"
                            error={form.errors.company_tagline}
                        >
                            <input
                                id="company_tagline"
                                value={form.data.company_tagline}
                                onChange={(e) =>
                                    form.setData(
                                        'company_tagline',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="Kota"
                            htmlFor="company_city"
                            error={form.errors.company_city}
                        >
                            <input
                                id="company_city"
                                value={form.data.company_city}
                                onChange={(e) =>
                                    form.setData('company_city', e.target.value)
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="Alamat"
                            htmlFor="company_address"
                            error={form.errors.company_address}
                        >
                            <textarea
                                id="company_address"
                                value={form.data.company_address}
                                onChange={(e) =>
                                    form.setData(
                                        'company_address',
                                        e.target.value,
                                    )
                                }
                                className={textareaClass}
                                rows={3}
                            />
                        </FormField>
                        <FormField
                            label="Jam operasional"
                            htmlFor="company_hours"
                            error={form.errors.company_hours}
                        >
                            <input
                                id="company_hours"
                                value={form.data.company_hours}
                                onChange={(e) =>
                                    form.setData(
                                        'company_hours',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5">
                    <h2 className="text-sm font-bold">Kontak & WhatsApp</h2>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            label="Email perusahaan"
                            htmlFor="company_email"
                            error={form.errors.company_email}
                        >
                            <input
                                id="company_email"
                                type="email"
                                value={form.data.company_email}
                                onChange={(e) =>
                                    form.setData(
                                        'company_email',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="Email perusahaan 2"
                            htmlFor="company_email_secondary"
                            error={form.errors.company_email_secondary}
                        >
                            <input
                                id="company_email_secondary"
                                type="email"
                                value={form.data.company_email_secondary}
                                onChange={(e) =>
                                    form.setData(
                                        'company_email_secondary',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="WhatsApp utama"
                            htmlFor="whatsapp_number"
                            error={form.errors.whatsapp_number}
                        >
                            <input
                                id="whatsapp_number"
                                value={form.data.whatsapp_number}
                                onChange={(e) =>
                                    form.setData(
                                        'whatsapp_number',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="WhatsApp sales"
                            htmlFor="whatsapp_sales"
                            error={form.errors.whatsapp_sales}
                        >
                            <input
                                id="whatsapp_sales"
                                value={form.data.whatsapp_sales}
                                onChange={(e) =>
                                    form.setData(
                                        'whatsapp_sales',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="WhatsApp servis"
                            htmlFor="whatsapp_service"
                            error={form.errors.whatsapp_service}
                        >
                            <input
                                id="whatsapp_service"
                                value={form.data.whatsapp_service}
                                onChange={(e) =>
                                    form.setData(
                                        'whatsapp_service',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5">
                    <h2 className="text-sm font-bold">Media sosial</h2>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            label="Instagram"
                            htmlFor="company_instagram"
                            error={form.errors.company_instagram}
                        >
                            <input
                                id="company_instagram"
                                value={form.data.company_instagram}
                                onChange={(e) =>
                                    form.setData(
                                        'company_instagram',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="Facebook"
                            htmlFor="company_facebook"
                            error={form.errors.company_facebook}
                        >
                            <input
                                id="company_facebook"
                                value={form.data.company_facebook}
                                onChange={(e) =>
                                    form.setData(
                                        'company_facebook',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="TikTok"
                            htmlFor="company_tiktok"
                            error={form.errors.company_tiktok}
                        >
                            <input
                                id="company_tiktok"
                                value={form.data.company_tiktok}
                                onChange={(e) =>
                                    form.setData(
                                        'company_tiktok',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="YouTube"
                            htmlFor="company_youtube"
                            error={form.errors.company_youtube}
                        >
                            <input
                                id="company_youtube"
                                value={form.data.company_youtube}
                                onChange={(e) =>
                                    form.setData(
                                        'company_youtube',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="LinkedIn"
                            htmlFor="company_linkedin"
                            error={form.errors.company_linkedin}
                        >
                            <input
                                id="company_linkedin"
                                value={form.data.company_linkedin}
                                onChange={(e) =>
                                    form.setData(
                                        'company_linkedin',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5">
                    <h2 className="text-sm font-bold">Hero</h2>
                    <div className="mt-4 grid gap-4">
                        {form.data.hero_background ? (
                            <div className="overflow-hidden rounded-lg border border-border">
                                <img
                                    src={form.data.hero_background}
                                    alt="Preview background hero"
                                    className="h-48 w-full object-cover"
                                />
                            </div>
                        ) : null}
                        <form
                            action="/admin/settings/hero-background"
                            method="post"
                            encType="multipart/form-data"
                            className="grid gap-3"
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? ''}
                            />
                            <FormField
                                label="Upload gambar background hero"
                                htmlFor="hero_background_file"
                            >
                                <input
                                    id="hero_background_file"
                                    name="hero_background"
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/80"
                                    required
                                />
                            </FormField>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, WebP, AVIF maksimal 5MB. Gambar akan otomatis diperkecil ke lebar 1920px dan dikonversi ke WebP agar lebih ringan.
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Upload & Konversi WebP
                                </button>
                                {form.data.hero_background ? (
                                    <button
                                        type="submit"
                                        formAction="/admin/settings/hero-background"
                                        formMethod="post"
                                        onClick={(event) => {
                                            const formElement = event.currentTarget.form;
                                            if (formElement) {
                                                const method = document.createElement('input');
                                                method.type = 'hidden';
                                                method.name = '_method';
                                                method.value = 'delete';
                                                formElement.appendChild(method);
                                            }
                                        }}
                                        className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
                                    >
                                        Kembalikan ke default random
                                    </button>
                                ) : null}
                            </div>
                        </form>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5">
                    <h2 className="text-sm font-bold">Halaman Tentang Kami</h2>
                    <div className="mt-4 grid gap-4">
                        {(form.data as any).about_image ? (
                            <div className="overflow-hidden rounded-lg border border-border">
                                <img
                                    src={(form.data as any).about_image}
                                    alt="Preview gambar tentang kami"
                                    className="h-48 w-full object-cover"
                                />
                            </div>
                        ) : null}
                        <form
                            action="/admin/settings/about-image"
                            method="post"
                            encType="multipart/form-data"
                            className="grid gap-3"
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? ''}
                            />
                            <FormField
                                label="Upload gambar halaman Tentang Kami"
                                htmlFor="about_image_file"
                            >
                                <input
                                    id="about_image_file"
                                    name="about_image"
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/80"
                                    required
                                />
                            </FormField>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, WebP, AVIF maksimal 5MB. Gambar akan otomatis dikonversi ke WebP.
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Upload gambar
                                </button>
                                {(form.data as any).about_image ? (
                                    <button
                                        type="submit"
                                        formAction="/admin/settings/about-image"
                                        formMethod="post"
                                        onClick={(event) => {
                                            const formElement = event.currentTarget.form;
                                            if (formElement) {
                                                const method = document.createElement('input');
                                                method.type = 'hidden';
                                                method.name = '_method';
                                                method.value = 'delete';
                                                formElement.appendChild(method);
                                            }
                                        }}
                                        className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
                                    >
                                        Hapus gambar
                                    </button>
                                ) : null}
                            </div>
                        </form>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5">
                    <h2 className="text-sm font-bold">Fitur</h2>
                    <div className="mt-4 grid gap-4">
                        <label className="flex items-start gap-3 rounded-lg border border-border p-4">
                            <input
                                type="checkbox"
                                className="mt-1 size-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                checked={
                                    form.data.service_enabled === 'true' ||
                                    form.data.service_enabled === true
                                }
                                onChange={(event) =>
                                    form.setData(
                                        'service_enabled',
                                        event.target.checked ? 'true' : 'false',
                                    )
                                }
                            />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">
                                    Aktifkan fitur Layanan Servis
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan menu Layanan, form pengajuan servis, cek status tiket, dan jalur servis di website publik.
                                </p>
                            </div>
                        </label>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5">
                    <h2 className="text-sm font-bold">Developer & SEO</h2>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            label="Email developer"
                            htmlFor="developer_email"
                            error={form.errors.developer_email}
                        >
                            <input
                                id="developer_email"
                                type="email"
                                value={form.data.developer_email}
                                onChange={(e) =>
                                    form.setData(
                                        'developer_email',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="WhatsApp developer"
                            htmlFor="developer_whatsapp"
                            error={form.errors.developer_whatsapp}
                        >
                            <input
                                id="developer_whatsapp"
                                value={form.data.developer_whatsapp}
                                onChange={(e) =>
                                    form.setData(
                                        'developer_whatsapp',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="Mode harga default"
                            htmlFor="default_price_mode"
                            error={form.errors.default_price_mode}
                        >
                            <select
                                id="default_price_mode"
                                value={form.data.default_price_mode}
                                onChange={(e) =>
                                    form.setData(
                                        'default_price_mode',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="show">Tampilkan harga</option>
                                <option value="contact">Hubungi kami</option>
                            </select>
                        </FormField>
                        <FormField
                            label="SEO title"
                            htmlFor="seo_title"
                            error={form.errors.seo_title}
                        >
                            <input
                                id="seo_title"
                                value={form.data.seo_title}
                                onChange={(e) =>
                                    form.setData('seo_title', e.target.value)
                                }
                                className={inputClass}
                            />
                        </FormField>
                        <FormField
                            label="SEO description"
                            htmlFor="seo_description"
                            error={form.errors.seo_description}
                        >
                            <textarea
                                id="seo_description"
                                value={form.data.seo_description}
                                onChange={(e) =>
                                    form.setData(
                                        'seo_description',
                                        e.target.value,
                                    )
                                }
                                className={textareaClass}
                                rows={3}
                            />
                        </FormField>
                    </div>
                </section>
            </div>
        </form>
    );
}
