"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { setLocaleAction } from "@/src/actions/set-locale-action"
import { AppLocale } from "@/src/i18n/config"

// Encapsula cambio de idioma con persistencia y refresco de Server Components.
export function useLanguagePreference() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const changeLocale = (locale: AppLocale) =>
    new Promise<void>((resolve) => {
      startTransition(() => {
        void (async () => {
          await setLocaleAction(locale)
          router.refresh()
          resolve()
        })()
      })
    })

  return {
    changeLocale,
    isPending,
  }
}
