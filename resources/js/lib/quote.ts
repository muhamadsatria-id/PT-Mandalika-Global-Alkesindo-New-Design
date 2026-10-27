import { useSyncExternalStore } from 'react';
import type { QuoteItem } from '@/types/catalog';

const STORAGE_KEY = 'mga.quote.v1';
export const MAX_QUOTE_QTY = 99;

let items: QuoteItem[] = [];
let loaded = false;
const listeners = new Set<() => void>();

const emit = (): void => {
    listeners.forEach((listener) => listener());
};

const isQuoteItem = (value: unknown): value is QuoteItem => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const item = value as Partial<QuoteItem>;

    return (
        typeof item.id === 'number' &&
        typeof item.name === 'string' &&
        typeof item.slug === 'string' &&
        typeof item.url === 'string' &&
        typeof item.qty === 'number'
    );
};

const readStorage = (): QuoteItem[] => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(isQuoteItem).map((item) => ({
            ...item,
            qty: Math.min(MAX_QUOTE_QTY, Math.max(1, Math.round(item.qty))),
        }));
    } catch {
        return [];
    }
};

const persist = (): void => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Penyimpanan lokal bisa tidak tersedia (mode privat); daftar tetap
        // berfungsi selama sesi berjalan.
    }
};

const ensureLoaded = (): void => {
    if (loaded) {
        return;
    }

    loaded = true;
    items = readStorage();
};

const publish = (next: QuoteItem[]): void => {
    items = next;
    persist();
    emit();
};

export const getQuote = (): QuoteItem[] => {
    ensureLoaded();

    return items;
};

export const addQuoteItem = (item: Omit<QuoteItem, 'qty'>, qty = 1): void => {
    const amount = Math.min(MAX_QUOTE_QTY, Math.max(1, Math.round(qty)));
    const existing = getQuote().find((entry) => entry.id === item.id);

    if (existing) {
        publish(
            items.map((entry) =>
                entry.id === item.id
                    ? {
                          ...entry,
                          qty: Math.min(MAX_QUOTE_QTY, entry.qty + amount),
                      }
                    : entry,
            ),
        );

        return;
    }

    publish([...items, { ...item, qty: amount }]);
};

export const removeQuoteItem = (id: number): void => {
    publish(getQuote().filter((item) => item.id !== id));
};

export const setQuoteQty = (id: number, qty: number): void => {
    const amount = Math.min(MAX_QUOTE_QTY, Math.max(1, Math.round(qty)));

    publish(
        items.map((item) => (item.id === id ? { ...item, qty: amount } : item)),
    );
};

export const clearQuote = (): void => {
    publish([]);
};

const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
};

const getServerSnapshot = (): QuoteItem[] => [];

export const useQuote = (): QuoteItem[] =>
    useSyncExternalStore(subscribe, getQuote, getServerSnapshot);

if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key !== STORAGE_KEY) {
            return;
        }

        loaded = true;
        items = readStorage();
        emit();
    });
}
