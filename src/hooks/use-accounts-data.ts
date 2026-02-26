import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"
import { getAccounts } from "@/src/data-layer/accounts"
import { SESSION_CACHE_INVALIDATE_EVENT } from "@/src/auth/session-cache-events"

// Centraliza carga reactiva de cuentas y limpieza de caché entre cambios de sesión.
export function useAccountsData(userCacheKey: string) {
  const { mutate: globalMutate } = useSWRConfig()

  useEffect(() => {
    const clearAccountsCache = () => {
      // Invalida todas las entradas "accounts" para evitar mezcla backend/local.
      globalMutate(
        (key) => Array.isArray(key) && key[0] === "accounts",
        undefined,
        { revalidate: false }
      )
    }

    // Escucha evento global de invalidación al cambiar login/origen de sesión.
    window.addEventListener(SESSION_CACHE_INVALIDATE_EVENT, clearAccountsCache)

    return () => {
      window.removeEventListener(SESSION_CACHE_INVALIDATE_EVENT, clearAccountsCache)
    }
  }, [globalMutate])

  // userCacheKey separa caché por usuario y tipo de sesión.
  const { data, error, isLoading, mutate } = useSWR(
    ["accounts", userCacheKey],
    () => getAccounts(),
    // Config orientada a estabilidad visual y retries acotados.
    {
      errorRetryCount: 1,
      errorRetryInterval: 2000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  )

  return {
    accounts: data ?? [],
    error,
    isLoading,
    mutate,
    isError: Boolean(error),
  }
}
