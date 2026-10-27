import { useEffect, useRef } from 'react';

type TurnstileWidgetProps = {
    siteKey: string;
    onToken: (token: string | null) => void;
};

export default function TurnstileWidget({
    siteKey,
    onToken,
}: TurnstileWidgetProps) {
    const container = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        let loadedHandler: (() => void) | null = null;

        const render = (): void => {
            if (
                cancelled ||
                !container.current ||
                !window.turnstile ||
                widgetId.current !== null
            ) {
                return;
            }

            widgetId.current = window.turnstile.render(container.current, {
                sitekey: siteKey,
                theme: document.documentElement.classList.contains('dark')
                    ? 'dark'
                    : 'light',
                callback: (token) => onToken(token),
                'expired-callback': () => onToken(null),
                'error-callback': () => onToken(null),
            });
        };

        if (window.turnstile) {
            render();
        } else {
            const existing = document.querySelector<HTMLScriptElement>(
                'script[data-mga-turnstile]',
            );

            if (existing) {
                loadedHandler = render;
                existing.addEventListener('load', loadedHandler);
            } else {
                const script = document.createElement('script');
                script.src =
                    'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                script.async = true;
                script.defer = true;
                script.dataset.mgaTurnstile = 'true';
                loadedHandler = render;
                script.addEventListener('load', loadedHandler);
                document.head.appendChild(script);
            }
        }

        return () => {
            cancelled = true;

            if (loadedHandler) {
                document
                    .querySelector<HTMLScriptElement>(
                        'script[data-mga-turnstile]',
                    )
                    ?.removeEventListener('load', loadedHandler);
            }
        };
    }, [siteKey, onToken]);

    return <div ref={container} className="min-h-[65px]" />;
}
