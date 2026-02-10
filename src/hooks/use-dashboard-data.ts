import useSWR from 'swr';

// Hook personalizado para datos del dashboard
export function useDashboardData(mode: "expenses" | "incomes", year: number) {
    // Fetcher que lanza error si la respuesta HTTP no es exitosa
    const fetcher = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        return await res.json();
    };

    // Configuración de SWR con optimizaciones para el dashboard
    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api/dashboard/${mode}/${year}`,
        fetcher,
        {
            keepPreviousData: true,      // Evita parpadeo al cambiar datos
            errorRetryCount: 1,          // Solo 1 reintento en errores
            errorRetryInterval: 2000,    // 2 segundos entre reintentos
            revalidateOnFocus: false,    // No revalida al cambiar de pestaña
            revalidateOnReconnect: false, // No revalida al recuperar conexión
            revalidateIfStale: false     // No revalida datos automáticamente
        }
    );

    return {
        data: data || [],  // Siempre devuelve array (vacío si no hay datos)
        isLoading,
        error,
        mutate,            // Para revalidar manualmente (botón "reintentar")
        isError: !!error,  // Booleano conveniente
    };
}