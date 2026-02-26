import "server-only"

import { cookies } from "next/headers"
import { AppLocale, DEFAULT_LOCALE, isLocale, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from "./config"

// Lee locale desde cookie con fallback a idioma por defecto.
export async function getLocaleFromCookie(): Promise<AppLocale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(LOCALE_COOKIE_NAME)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

// Persiste locale en cookie para que sea accesible en server/client y sobreviva reinicios.
export async function persistLocaleCookie(localeInput: string | null | undefined): Promise<AppLocale> {
  const cookieStore = await cookies()
  const locale = isLocale(localeInput) ? localeInput : DEFAULT_LOCALE

  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: "/",
  })

  return locale
}
