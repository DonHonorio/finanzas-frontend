"use client"

// Claves locales que marcan sesión/onboarding en cliente.
const LOCAL_STORAGE_KEYS = ["localToken", "fp_onboarding_completed"]
const LOCAL_COOKIE_KEYS = ["localToken", "localBaseCurrency", "localTimeZone"]

// Elimina indicadores de sesión local para dejar el navegador en estado backend-only.
export function clearLocalSessionIndicators() {
  if (typeof window === "undefined") return

  // Limpieza de storage persistente en navegador.
  for (const key of LOCAL_STORAGE_KEYS) {
    window.localStorage.removeItem(key)
  }

  // Limpieza de cookies auxiliares usadas por sesión/configuración local.
  for (const key of LOCAL_COOKIE_KEYS) {
    document.cookie = `${key}=; path=/; max-age=0; samesite=lax`
  }
}
