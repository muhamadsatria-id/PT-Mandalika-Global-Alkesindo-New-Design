import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
    Baru: 'bg-primary/10 text-primary-strong',
    Dihubungi: 'bg-warning/10 text-warning',
    'Penawaran Terkirim': 'bg-secondary text-foreground',
    Negosiasi: 'bg-warning/10 text-warning',
    Deal: 'bg-success/10 text-success',
    Batal: 'bg-destructive/10 text-destructive',
    Diterima: 'bg-primary/10 text-primary-strong',
    Dijadwalkan: 'bg-warning/10 text-warning',
    Diagnosa: 'bg-warning/10 text-warning',
    'Menunggu Persetujuan': 'bg-warning/10 text-warning',
    Dikerjakan: 'bg-primary/10 text-primary-strong',
    Pengujian: 'bg-primary/10 text-primary-strong',
    Selesai: 'bg-success/10 text-success',
    Diambil: 'bg-success/10 text-success',
    Dikirim: 'bg-success/10 text-success',
};

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap',
                styles[status] ?? 'bg-secondary text-muted-foreground',
            )}
        >
            {status}
        </span>
    );
}
