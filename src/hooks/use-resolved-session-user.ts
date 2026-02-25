"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { UserSchema } from "@/src/schemas"
import { getLocalUser } from "@/src/data-layer/users.client"
import { LOCAL_USER_UPDATED_EVENT } from "@/src/data-layer/profile.client"

type User = z.infer<typeof UserSchema>

// Devuelve usuario efectivo de sesión: backend directo o local resuelto en cliente.
export function useResolvedSessionUser(
  initialUser: User | null | undefined,
  source: "backend" | "local" | "none" | undefined
) {
  const [resolvedUser, setResolvedUser] = useState<User | null>(initialUser ?? null)

  useEffect(() => {
    let isMounted = true

    // En sesión no-local, reutiliza el usuario inicial sin fetch adicional.
    if (source !== "local") {
      setResolvedUser(initialUser ?? null)
      return () => {
        isMounted = false
      }
    }

    const loadLocalUser = () => {
      getLocalUser().then((user) => {
        if (isMounted) setResolvedUser(user)
      })
    }

    // Carga inicial + recarga reactiva cuando se actualiza configuración local.
    loadLocalUser()

    const handleLocalUserUpdated = () => {
      loadLocalUser()
    }

    window.addEventListener(LOCAL_USER_UPDATED_EVENT, handleLocalUserUpdated)

    return () => {
      window.removeEventListener(LOCAL_USER_UPDATED_EVENT, handleLocalUserUpdated)
      isMounted = false
    }
  }, [source, initialUser])

  return resolvedUser
}
