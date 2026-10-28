import { Link } from '@inertiajs/react';
import { ArrowUpRight, CalendarCheck, FileText, GraduationCap, MessageCircle, Phone, Stethoscope, Truck, Wrench } from 'lucide-react';
import Seo from '@/components/seo';
import { whatsAppLink } from '@/lib/whatsapp';
import { contact } from '@/routes';
import catalog from '@/routes/catalog';
import service from '@/routes/service';
import type { SeoData } from '@/types/catalog';

type LayananProps = {
    seo: SeoData;
    company: {
        whatsapp_sales: string | null;
        whatsapp_servis: string | null;
        jam_operasional: string | null;
        waktu_respons: string | null;
        layanan_darurat: string | null;
        cakupan_servis: string | null;
        area_layanan: string | null;
    };
};

const services = [
    {
        title: 'Pengadaan Alat Kesehatan',
        description: 'Pemilihan unit sesuai kebutuhan ruang, alur kerja, anggaran, dan regulasi untuk rumah sakit, klinik, maupun dinas kesehatan.',
        icon: FileText,
    },
    {
        title: 'Instalasi & Pelatihan',
        description: 'Pemasangan, uji fungsi, pelatihan penggunaan oleh tim teknis agar alat siap dioperasikan dengan aman.',
        icon: GraduationCap,
    },
    {
        title: 'Servis & Kalibrasi',
        description: 'Diagnosa, perbaikan, perawatan berkala, dan penjadwalan servis untuk menjaga alat tetap andal.',
        icon: Wrench,
    },
    {
        title: 'Konsultasi Teknis',
        description: 'Pendampingan perencanaan pengadaan, rekomendasi spesifikasi, dan koordinasi teknis untuk kebutuhan institusi.',
        icon: Stethoscope,
    },
];

const steps = [
    {
        number: '01',
        title: 'Ceritakan kebutuhan',
        description: 'Sampaikan jenis alat, jumlah unit, lokasi, atau kendala alat melalui WhatsApp atau formulir kontak.',
    },
    {
        number: '02',
        title: 'Kami siapkan rekomendasi & penawaran',
        description: 'Tim menyesuaikan pilihan unit, menjelaskan kelengkapan, dan menyiapkan penawaran yang jelas.',
    },
    {
        number: '03',
        title: 'Tindak lanjut',
        description: 'Pengiriman, instalasi/pelatihan, atau penjadwalan teknisi dibahas langsung dengan tim kami.',
    },
];

const prepList = [
    'Nama instansi/fasilitas kesehatan',
    'Jenis alat yang dibutuhkan atau kendala yang dihadapi',
    'Jumlah unit & spesifikasi yang diinginkan (bila ada)',
    'Foto/label alat (untuk pengajuan servis)',
    'Alamat pengiriman/lokasi instalasi (kota/kabupaten)',
    'Kontak penanggung jawab & nomor WhatsApp',
];

export default function LayananIndex({ seo, company }: LayananProps) {
    const salesMessage = 'Halo PT. Mandalika Global Alkesindo, saya ingin meminta penawaran alat kesehatan.';
    const serviceMessage = 'Halo PT. Mandalika Global Alkesindo, saya ingin menanyakan layanan servis alat kesehatan.';

    const quoteLink = company.whatsapp_sales ? whatsAppLink(company.whatsapp_sales, salesMessage) : null;
    const serviceLink = company.whatsapp_servis ? whatsAppLink(company.whatsapp_servis, serviceMessage) : null;

    return (
        <>
            <Seo seo={seo} />

            <section className="border-b border-border">
                <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-12 sm:px-6 lg:px-8 lg:pt-14 lg:pb-16">
                    <nav aria-label="Remah roti" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={contact.url().replace('/kontak', '')} className="hover:text-foreground">
                            Beranda
                        </Link>
                        <span>/</span>
                        <span className="text-foreground">Layanan</span>
                    </nav>

                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                                Layanan Pengadaan, Instalasi & Servis Alat Kesehatan
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                Satu tim menangani pengadaan, instalasi & pelatihan, servis & kalibrasi, serta konsultasi teknis untuk rumah sakit, klinik, dan dinas kesehatan.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                {quoteLink && (
                                    <a
                                        href={quoteLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                                    >
                                        <MessageCircle className="size-4" aria-hidden="true" />
                                        Minta penawaran
                                    </a>
                                )}
                                {serviceLink && (
                                    <a
                                        href={serviceLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-7 text-sm font-semibold transition-colors hover:bg-secondary"
                                    >
                                        <Wrench className="size-4" aria-hidden="true" />
                                        Ajukan servis via WhatsApp
                                    </a>
                                )}
                                <Link
                                    href={catalog.index.url()}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Jelajahi katalog
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-lg font-semibold">Ringkas layanan</h2>
                            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <FileText className="mt-0.5 size-4 text-primary" />
                                    <span>Pengadaan alat kesehatan bersertifikasi</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <GraduationCap className="mt-0.5 size-4 text-primary" />
                                    <span>Instalasi, uji fungsi & pelatihan</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Wrench className="mt-0.5 size-4 text-primary" />
                                    <span>Servis, perawatan & kalibrasi</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Stethoscope className="mt-0.5 size-4 text-primary" />
                                    <span>Konsultasi teknis & pendampingan</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="layanan" className="border-b border-border">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8 max-w-2xl">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Layanan Kami</h2>
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Kami mendampingi dari pemilihan unit hingga alat siap digunakan dan tetap terjaga.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((item) => {
                            const Icon = item.icon;
                            return (
                                <article key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <div className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="size-5" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="border-b border-border bg-secondary/30">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8 max-w-2xl">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Alur Layanan</h2>
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Proses ringkas, dibahas langsung dengan tim yang sama.
                        </p>
                    </div>
                    <ol className="grid gap-4 md:grid-cols-3">
                        {steps.map((step, index) => (
                            <li key={step.number} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-semibold tabular-nums text-primary">{step.number}</span>
                                    <span className="text-xs text-muted-foreground">Langkah {index + 1}</span>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold tracking-tight">{step.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="border-b border-border">
                <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Cakupan Wilayah & Mekanisme Servis</h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {company.area_layanan ?? 'Melayani pengiriman, instalasi, dan pendampingan teknis ke rumah sakit, klinik, dan fasilitas kesehatan di seluruh Indonesia.'}
                        </p>
                        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <Truck className="mt-0.5 size-4 text-primary" />
                                <span>{company.cakupan_servis ?? 'Pengadaan, instalasi, pelatihan, servis & kalibrasi alat kesehatan.'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Wrench className="mt-0.5 size-4 text-primary" />
                                <span>Servis bisa dilakukan dengan teknisi datang ke lokasi atau koordinasi pengiriman unit sesuai kebutuhan.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-lg font-semibold">Info Darurat, Jam Operasional & Waktu Respons</h3>
                        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <CalendarCheck className="mt-0.5 size-4 text-primary" />
                                <div>
                                    <p className="font-medium text-foreground">Jam Operasional</p>
                                    <p>{company.jam_operasional ?? 'TODO: Jam operasional belum diisi'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="mt-0.5 size-4 text-primary" />
                                <div>
                                    <p className="font-medium text-foreground">Waktu Respons</p>
                                    <p>{company.waktu_respons ?? 'TODO: Waktu respons belum diisi'}</p>
                                </div>
                            </div>
                            {company.layanan_darurat && (
                                <div className="flex items-start gap-2">
                                    <MessageCircle className="mt-0.5 size-4 text-primary" />
                                    <div>
                                        <p className="font-medium text-foreground">Layanan Darurat</p>
                                        <p>{company.layanan_darurat}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-border">
                <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Info yang Perlu Disiapkan</h2>
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Agar penawaran/servis bisa diproses lebih cepat, siapkan data berikut.
                        </p>
                        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                            {prepList.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="mt-1 size-1.5 rounded-full bg-primary" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-lg font-semibold">Butuh Bantuan Langsung?</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Kirim kebutuhan atau kendala alat Anda lewat WhatsApp. Tim kami akan membantu langkah selanjutnya.
                        </p>
                        <div className="mt-6 flex flex-col gap-3">
                            {quoteLink && (
                                <a
                                    href={quoteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                                >
                                    <MessageCircle className="size-4" aria-hidden="true" />
                                    Minta penawaran
                                </a>
                            )}
                            {serviceLink && (
                                <a
                                    href={serviceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-secondary"
                                >
                                    <Wrench className="size-4" aria-hidden="true" />
                                    Ajukan servis via WhatsApp
                                </a>
                            )}
                            <Link
                                href={service.index.url()}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Lihat alur di halaman Layanan Servis
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
