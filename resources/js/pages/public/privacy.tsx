import { Link, usePage } from '@inertiajs/react';
import Seo from '@/components/seo';
import { contact, home } from '@/routes';
import type { SharedData } from '@/types';
import type { SeoData } from '@/types/catalog';

type PrivacyProps = {
    seo: SeoData;
};

const sections = [
    {
        title: 'Data yang kami kumpulkan',
        body: [
            'Saat Anda mengirim daftar penawaran, kami menerima nama, nama instansi, kota, nomor WhatsApp, email (bila diisi), dan catatan kebutuhan. Kami juga mencatat sumber kunjungan seperti parameter UTM, halaman awal, dan alamat perujuk untuk memahami asal permintaan.',
            'Saat Anda mengajukan servis, kami juga menerima nama alat, brand, model, nomor seri (bila diisi), keluhan, lokasi alat, preferensi penanganan, serta foto atau video yang Anda unggah. Lampiran disimpan untuk membantu teknisi melakukan diagnosa dan tidak ditampilkan ke publik.',
            'Kami tidak meminta data pembayaran melalui situs ini. Transaksi dan pembayaran diproses langsung bersama tim melalui jalur resmi perusahaan.',
        ],
    },
    {
        title: 'Tujuan penggunaan',
        body: [
            'Data dipakai untuk menghubungi Anda, menyiapkan penawaran, menindaklanjuti permintaan servis, dan meningkatkan kualitas layanan. Data tidak dijual atau diserahkan kepada pihak lain untuk tujuan pemasaran tanpa persetujuan Anda.',
        ],
    },
    {
        title: 'Penyimpanan dan akses',
        body: [
            'Data disimpan pada sistem internal yang aksesnya dibatasi untuk tim penjualan, layanan, dan administrator yang berkepentingan. Kami menyimpan data selama diperlukan untuk tindak lanjut dan kewajiban administratif.',
        ],
    },
    {
        title: 'Hak Anda',
        body: [
            'Anda dapat meminta akses, koreksi, atau penghapusan data dengan menghubungi kami melalui kanal kontak resmi. Kami akan memproses permintaan sesuai ketentuan yang berlaku, termasuk Undang-Undang Pelindungan Data Pribadi.',
        ],
    },
    {
        title: 'Cookie dan penyimpanan lokal',
        body: [
            'Situs menggunakan penyimpanan lokal browser untuk menyimpan daftar penawaran dan sumber kunjungan selama sesi. Data ini tidak dikirim ke pihak ketiga dan dapat dihapus dengan mengosongkan daftar atau membersihkan data browser.',
        ],
    },
];

export default function Privacy({ seo }: PrivacyProps) {
    const { settings } = usePage<SharedData>().props;

    return (
        <>
            <Seo seo={seo} />

            <div className="mx-auto w-full max-w-3xl px-4 pt-10 pb-16 sm:px-6">
                <nav aria-label="Remah roti" className="text-xs">
                    <Link
                        href={home.url()}
                        className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                        Beranda
                    </Link>
                    <span
                        className="mx-2 text-muted-foreground/60"
                        aria-hidden="true"
                    >
                        /
                    </span>
                    <span className="font-semibold">Kebijakan privasi</span>
                </nav>

                <h1 className="mt-6 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
                    Kebijakan privasi
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Halaman ini menjelaskan bagaimana PT. Mandalika Global
                    Alkesindo mengelola data yang Anda kirim melalui situs.
                </p>

                <div className="mt-10 space-y-8">
                    {sections.map((section, index) => (
                        <section key={section.title}>
                            <h2 className="text-base font-extrabold tracking-tight">
                                {index + 1}. {section.title}
                            </h2>
                            <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                                {section.body.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="mt-10 rounded-lg border border-border bg-card p-5">
                    <h2 className="text-sm font-bold">Pertanyaan privasi</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Hubungi tim kami melalui halaman kontak
                        {settings.company_email
                            ? ` atau email ${settings.company_email}`
                            : ''}{' '}
                        untuk pertanyaan terkait data pribadi Anda.
                    </p>
                    <Link
                        href={contact.url()}
                        className="mt-4 inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-semibold hover:bg-secondary"
                    >
                        Buka halaman kontak
                    </Link>
                </div>
            </div>
        </>
    );
}
