export type TrackingData = {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    referrer: string | null;
    landing_url: string | null;
};

const STORAGE_KEY = 'mga.tracking.v1';

const emptyTracking = (): TrackingData => ({
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    referrer: null,
    landing_url: null,
});

const read = (): TrackingData | null => {
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return null;
        }

        const parsed: unknown = JSON.parse(raw);

        if (typeof parsed !== 'object' || parsed === null) {
            return null;
        }

        return { ...emptyTracking(), ...(parsed as Partial<TrackingData>) };
    } catch {
        return null;
    }
};

const write = (data: TrackingData): void => {
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Abaikan bila sessionStorage tidak tersedia.
    }
};

/**
 * Simpan sumber kunjungan pertama (first touch) selama sesi browser.
 * Dipanggil sekali saat aplikasi dimuat.
 */
export const captureTracking = (): TrackingData | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const params = new URLSearchParams(window.location.search);
    const stored = read();

    if (stored?.landing_url) {
        return stored;
    }

    const data: TrackingData = {
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        utm_term: params.get('utm_term'),
        utm_content: params.get('utm_content'),
        referrer: document.referrer || null,
        landing_url: window.location.href,
    };

    write(data);

    return data;
};

export const getTracking = (): TrackingData => {
    if (typeof window === 'undefined') {
        return emptyTracking();
    }

    return read() ?? emptyTracking();
};
