import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"
import { getAccounts } from "@/src/data-layer/accounts"
import { SESSION_CACHE_INVALIDATE_EVENT } from "@/src/auth/session-cache-events"

export function useAccountsData(userCacheKey: string) {
  const { mutate: globalMutate } = useSWRConfig()

  useEffect(() => {
    const clearAccountsCache = () => {
      globalMutate(
        (key) => Array.isArray(key) && key[0] === "accounts",
        undefined,
        { revalidate: false }
      )
    }

    window.addEventListener(SESSION_CACHE_INVALIDATE_EVENT, clearAccountsCache)

    return () => {
      window.removeEventListener(SESSION_CACHE_INVALIDATE_EVENT, clearAccountsCache)
    }
  }, [globalMutate])

  const { data, error, isLoading, mutate } = useSWR(
    ["accounts", userCacheKey],
    () => getAccounts(),
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
