/**
 * Normalisasi nomor WhatsApp ke format 62xxxxxxxxxx.
 * Logika ini harus sama dengan App\Services\WhatsAppLinkService::normalize().
 */
export function normalizeWhatsAppNumber(number: string): string {
    const digits = number.replace(/\D+/g, '');

    if (digits.startsWith('0')) {
        return `62${digits.slice(1)}`;
    }

    if (!digits.startsWith('62')) {
        return `62${digits}`;
    }

    return digits;
}

export function whatsAppLink(number: string, message: string): string {
    return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}

export const defaultWhatsAppMessage =
    'Halo PT. Mandalika Global Alkesindo, saya ingin bertanya tentang produk dan layanan.';
