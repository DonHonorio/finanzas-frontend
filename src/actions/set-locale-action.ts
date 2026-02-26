"use server"

import { persistLocaleCookie } from "@/src/i18n/cookies"
import { AppLocale } from "@/src/i18n/config"

// Server action reutilizable para actualizar preferencia de idioma por cookie.
export async function setLocaleAction(locale: AppLocale) {
  return persistLocaleCookie(locale)
}
