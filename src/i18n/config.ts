export const APP_LOCALES = ["en", "es"] as const
export type AppLocale = (typeof APP_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = "en"
export const LOCALE_COOKIE_NAME = "FP_LOCALE"
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && APP_LOCALES.includes(value as AppLocale)
}
