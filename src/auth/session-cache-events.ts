"use client"

// Evento global para invalidar cachés dependientes de sesión (SWR, vistas protegidas, etc.).
export const SESSION_CACHE_INVALIDATE_EVENT = "session-cache-invalidate"

// Emite invalidación de caché en cliente tras cambios de sesión/login/logout/migración.
export function emitSessionCacheInvalidate() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(SESSION_CACHE_INVALIDATE_EVENT))
}
