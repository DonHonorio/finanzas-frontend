import { useEffect } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { getDashboardData } from '@/src/data-layer/dashboard'
import { SESSION_CACHE_INVALIDATE_EVENT } from '@/src/auth/session-cache-events'

// Hook personalizado para datos del dashboard
export function useDashboardData(mode: "expenses" | "incomes", year: number, userCacheKey: string) {
    // Fetcher único que delega en data-layer (backend/local).
    const fetcher = async () => getDashboardData(mode, year)
    const { mutate: globalMutate } = useSWRConfig()

    useEffect(() => {
        // Limpia caché de dashboard cuando cambian indicadores de sesión.
        const clearDashboardCache = () => {
            globalMutate(
                (key) => Array.isArray(key) && key[0] === 'dashboard',
                undefined,
                { revalidate: false }
            )
        }

        window.addEventListener(SESSION_CACHE_INVALIDATE_EVENT, clearDashboardCache)

        return () => {
            window.removeEventListener(SESSION_CACHE_INVALIDATE_EVENT, clearDashboardCache)
        }
    }, [globalMutate])

    // Configuración de SWR con optimizaciones para el dashboard
    const { data, error, isLoading, mutate } = useSWR(
        // Key con userCacheKey para separar caché por usuario/sesión.
        ['dashboard', userCacheKey, mode, year],
        fetcher,
        {
            keepPreviousData: true,      // Evita parpadeo al cambiar datos
            errorRetryCount: 1,          // Solo 1 reintento en errores
            errorRetryInterval: 2000,    // 2 segundos entre reintentos
            revalidateOnFocus: false,    // No revalida al cambiar de pestaña
            revalidateOnReconnect: false, // No revalida al recuperar conexión
            revalidateIfStale: false     // No revalida datos automáticamente
        }
    )

    return {
        data: data || [],  // Siempre devuelve array (vacío si no hay datos)
        isLoading,
        error,
        mutate,            // Para revalidar manualmente (botón "reintentar")
        isError: !!error,  // Booleano conveniente
    }
}