import useSWR from 'swr';

export function useDashboardData(mode: "expenses" | "incomes", year: number) {
    const fetcher = async (url: string) => {
        const res = await fetch(url);

        if (!res.ok) {
            // Lanza un error específico con estado
            throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }

        return await res.json();
    };

    const { data, error, isLoading, mutate } = useSWR(
        `/api/dashboard/${mode}/${year}`,
        fetcher,
        {
            keepPreviousData: true,
            errorRetryCount: 1, // Reintentar 2 veces
            errorRetryInterval: 2000, // 2 segundos
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false
        }
    );

    return {
        data: data || [],
        isLoading,
        error,
        mutate,
        isError: !!error,
    };
}