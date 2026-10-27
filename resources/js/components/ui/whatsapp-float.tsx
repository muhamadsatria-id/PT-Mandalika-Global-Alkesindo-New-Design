import { MessageCircle } from 'lucide-react';
import {
    defaultWhatsAppMessage,
    whatsAppLink,
} from '@/lib/whatsapp';

type WhatsAppFloatProps = {
    number: string;
    message?: string;
    label?: string;
};

/**
 * Tombol WhatsApp melayang. Satu aksi yang jelas, tanpa menu tersembunyi,
 * agar tetap dapat dijangkau pengguna ponsel dan pembaca layar.
 */
export default function WhatsAppFloat({
    number,
    message = defaultWhatsAppMessage,
    label = 'Chat WhatsApp',
}: WhatsAppFloatProps) {
    return (
        <a
            href={whatsAppLink(number, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="group fixed right-4 bottom-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_rgba(242,71,12,0.7)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none sm:right-6 sm:bottom-6"
            aria-label={`${label} (membuka WhatsApp di tab baru)`}
        >
            <MessageCircle className="size-6" aria-hidden="true" />
            <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground shadow-sm group-hover:block group-focus-visible:block">
                {label}
            </span>
        </a>
    );
}
