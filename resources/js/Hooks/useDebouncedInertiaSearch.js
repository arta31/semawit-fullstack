import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

/**
 * Search/filter kolom tabel Inertia (server-side, ikut pagination) dengan debounce.
 * `params` awal diisi dari query string yang dikirim controller (agar tetap terisi setelah reload/paginate).
 */
export default function useDebouncedInertiaSearch(routeName, initialParams = {}, delay = 400) {
    const [params, setParams] = useState(initialParams);
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(route(routeName), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, delay);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    const setParam = (key, value) => setParams((prev) => ({ ...prev, [key]: value }));

    return [params, setParam];
}
